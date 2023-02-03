import React, { useRef, useState } from "react";
import { Button, Typography, Grid } from "@mui/material";
import axios from "axios";

function UploadFile() {
  const uploadInputRef = useRef();
  const [fileUploadState, setFileUploadState] = useState("");
  const [file, setFile] = useState();
  const handleFileFieldChange = async (e) => {
    try {
      setFile(e.target.files[0]);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("fileName", e.target.files[0].name);
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,

        {
          onUploadProgress: (e) => {
            let loadedPercent = Math.round((e.loaded * 100) / e.total);
            setFileUploadState(response.data.message);
          },
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "JWT fefege...",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      setFileUploadState(response.data.message );
      
    } catch (error) {
      console.log("error:::", error);
      setFileUploadState(error.message);
    }
  };
  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Button variant="contained" component="label">
            Upload
            <input
              hidden
              multiple
              type="file"
              onChange={(e) => {
                handleFileFieldChange(e);
              }}
            />
          </Button>
        </Grid>
        <Grid xs={12} md={12}>
          <Typography
            color="textSecondary"
            variant="caption"
            component="span"
            id={`file-uploaded`}
          >
            {fileUploadState}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default UploadFile;
