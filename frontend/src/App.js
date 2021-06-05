import "./App.css";
import { Button, makeStyles } from "@material-ui/core";
import { API, Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import LoadingOverlay from "react-loading-overlay";

const useStyles = makeStyles((theme) => ({
  panel: {
    "& > *": {
      margin: theme.spacing(1),
    },
    padding: theme.spacing(1),
  },
  button: {
    width: theme.spacing(17),
  },
}));

export default function App() {
  const classes = useStyles();
  const table = "test_data";
  const URL = "api/data";
  const endpoint = "MyApiGateway";

  const [isAuth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const currentSession = async () => {
      try {
        const response = await Auth.currentSession();
        if (response) {
          setAuth(true);
          setEmail(response.getIdToken().payload.email);
          setData(response);
          console.log(response);
        }
      } catch (e) {
        console.log(e);
      }
    };

    currentSession();
  }, []);

  async function getItem() {
    setLoading(true);
    console.log(API);
    try {
      const response = await API.post(endpoint, URL, {
        body: {
          operation: "get",
          tableName: table,
          payload: {
            Key: {
              id: "1",
            },
          },
        },
      });
      setData(response);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function putItem() {
    setLoading(true);
    try {
      const response = await API.post(endpoint, URL, {
        body: {
          operation: "put",
          tableName: table,
          payload: {
            Item: {
              id: "1",
              lastSeen: new Date(),
              isValid: true,
              desc: "Test",
            },
          },
        },
      });
      setData(response);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function updateItem() {
    setLoading(true);
    try {
      const response = await API.post(endpoint, URL, {
        body: {
          operation: "update",
          tableName: table,
          payload: {
            Key: {
              id: "1",
            },
            AttributeUpdates: {
              newField: {
                Action: "PUT",
                Value: "Some Value",
              },
            },
          },
        },
      });
      setData(response);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function deleteItem() {
    setLoading(true);
    try {
      const response = await API.post(endpoint, URL, {
        body: {
          operation: "delete",
          tableName: table,
          payload: {
            Key: {
              id: "1",
            },
          },
        },
      });
      setData(response);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function scan() {
    setLoading(true);
    try {
      const response = await API.post(endpoint, URL, {
        body: {
          operation: "scan",
          tableName: table,
          payload: {},
        },
      });
      setData(response);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const signIn = () => {
    Auth.federatedSignIn();
  };

  const signOut = async () => {
    await Auth.signOut();
    setAuth(false);
  };

  return (
    <LoadingOverlay active={isLoading} spinner text="Loading. Please wait..." className="App">
      <div>
        <div className={classes.panel}>
          <Button onClick={signIn} className={classes.button} variant="contained" color="primary">
            Sign In
          </Button>
          <Button onClick={signOut} className={classes.button} variant="contained">
            Sing Out
          </Button>
          <span className={classes.button}>{isAuth ? "Welcome " + email : "Please sign in"}</span>
        </div>
        <div className={classes.panel}>
          <Button onClick={putItem} className={classes.button} variant="contained" color="primary">
            Put Item
          </Button>
          <Button onClick={getItem} className={classes.button} variant="contained">
            Get Item
          </Button>
          <Button onClick={updateItem} className={classes.button} variant="contained">
            Update Item
          </Button>
          <Button onClick={scan} className={classes.button} variant="contained">
            Scan
          </Button>
          <Button onClick={deleteItem} className={classes.button} variant="contained" color="secondary">
            Delete Item
          </Button>
        </div>
        <ReactJson src={data} name={false} theme="monokai" style={{ fontSize: 15 }} />
      </div>
    </LoadingOverlay>
  );
}
