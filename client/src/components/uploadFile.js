import React, { useRef, useState } from "react";
import { Button, Typography, Grid } from "@mui/material";
import axios from "axios";

function UploadFile() {
  const [fileUploadState, setFileUploadState] = useState({
    uploaded: [],
    notUploaded: [],
  });
  const [file, setFile] = useState();
  const [uploadProgress, setUploadProgress] = useState({
    loading: false,
    total: 0,
    uploadPercent: 0,
    loadedTotal: 0,
    loaded: {},
  });
  const uploadOneFile = (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        setFile(file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        const response = await axios.post(
          "http://localhost:3001/upload",
          formData,
          {
            onUploadProgress: (e) => {
              setUploadProgress((state) => {
                let loadedPercent = state.uploadPercent;
                let loaded = {...state.loaded};
                let totalLoaded = state.loadedTotal;
                totalLoaded -= loaded[file.name];
                loaded[file.name] = e.loaded;
                totalLoaded += e.loaded;
                console.log("loaded", e.loaded, totalLoaded);
                loadedPercent += Math.round((totalLoaded * 100) / state.total);
                return {
                  ...state,
                  uploadPercent: loadedPercent,
                  loaded: loaded,
                  loadedTotal: totalLoaded,
                };
              });
            },
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // Authorization: "JWT fefege...",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        resolve({ message: response.data.message, file: file.name });
        // setUploadProgress((state) => {
        //   let loadedPercent = state.uploadPercent;
        //   console.log(
        //     "loaded",
        //    Math.round((file.size * 100) / state.total)
        //   );
        //   loadedPercent += Math.round((file.size * 100) / state.total);
        //   return { ...state, uploadPercent: loadedPercent };
        // });
      } catch (error) {
        console.log("error:::", error);
        reject({ message: error.message, file: file.name });
      }
    });
  };
  const handleFileFieldChange = async (e) => {
    setFileUploadState({
      uploaded: [],
      notUploaded: [],
    });
    setUploadProgress({
      loading: false,
      total: 0,
      uploadPercent: 0,
      loadedTotal: 0,
      loaded: {},
    });
    let files = e.target.files;
    setUploadProgress((state) => {
      
      let loaded = {};
     
      let newTotal = 0;
      Object.values(files).forEach((file) => {
        loaded[file.name] = 0;
        newTotal += file.size;
      });
      
      return { ...state, total: newTotal, loading: true, loaded: loaded };
    });

    for (let i = 0; i < files.length; i++) {
      try {
        let result = await uploadOneFile(files[i]);
        setFileUploadState((state) => {
          let uploaded = [...state.uploaded, result.file];
          return { ...state, uploaded: uploaded };
        });
      } catch (error) {
        console.log("error:::", error);
        setFileUploadState((state) => {
          let notUploaded = [...state.notUploaded, error.file];
          return { ...state, notUploaded: notUploaded };
        });
      }
    }
    setUploadProgress((state) => {
      return { ...state, loading: false };
    });
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
          {uploadProgress.loading ? (
            <Typography
              color="textSecondary"
              variant="h5"
              component="span"
              id={`file-upload-progress`}
            >
              {`${uploadProgress.uploadPercent}%`}
            </Typography>
          ) : (
            ""
          )}
          {fileUploadState.uploaded.length > 0 ? (
            <Grid container>
              <Grid xs={12} md={12}>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  component="span"
                  id={`file-uploaded`}
                >
                  successfully Uploaded!
                </Typography>
              </Grid>
              {fileUploadState.uploaded.map((file) => (
                <Grid xs={12} md={12}>
                  <Typography
                    style={{ color: "green" }}
                    variant="caption"
                    component="span"
                    id={`file-uploaded${file}`}
                  >
                    {`- ${file}`}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          ) : (
            ""
          )}
        </Grid>
        <Grid xs={12} md={12}>
          {fileUploadState.notUploaded.length > 0 ? (
            <Grid container>
              <Grid xs={12} md={12}>
                <Typography
                  color="textSecondary"
                  variant="h6"
                  component="span"
                  id={`file-uploaded`}
                >
                  Failed to Upload!
                </Typography>
              </Grid>
              {fileUploadState.notUploaded.map((file) => (
                <Grid xs={12} md={12}>
                  <Typography
                    style={{ color: "red" }}
                    variant="caption"
                    component="span"
                    id={`file-uploaded${file}`}
                  >
                    {`- ${file}`}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default UploadFile;
