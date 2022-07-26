// GET ALL

import express from "express";
import bodyParser from "body-parser";

const app = express();

const PORT = 3000;

app.use(bodyParser.json());

import fetch from "node-fetch";

// QUERY AND MUTATION

const GETALL_OPERATION = `
query MyQuery {
  users {
    id,name
  }
}
`;

const DELETE_OPERATION = `
mutation($id: Int) {
  delete_users(where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      id
      name
    }
  }
}
`;

const UPDATE_OPERATION = `
mutation ($id: Int, $name: String,$email: String) {
  update_users(where: {id: {_eq: $id}}, _set: {name: $name, email: $email}) {
    affected_rows
    returning {
      id
      name
      email
    }
  }
}
`;

const CREATE_OPERATION = `
mutation ($name: String!, $email: String!, $mobile: bigint!) {
  insert_users_one(object: {
    name: $name,
    email: $email,
    mobile: $mobile
  }) {
    id, name,email
  }
}
`;

// ALL USER
const executeAll = async (variables) => {
  const fetchResponse = await fetch(
    "https://mighty-hyena-98.hasura.app/v1/graphql",
    {
      method: "POST",
      headers: {
        "x-hasura-admin-secret":
          "pKafh99phI945uGqnYLetXE5ema0EY6neMjDbsBYiRRhnMHP4cg39txqdsodbFhd",
      },
      body: JSON.stringify({
        query: GETALL_OPERATION,
        variables,
      }),
    }
  );
  const data = await fetchResponse.json();
  console.log("DEBUG: ", JSON.stringify(data));
  return data;
};

// DELETE ONE

const executeDelete = async (variables) => {
  const fetchResponse = await fetch(
    "https://mighty-hyena-98.hasura.app/v1/graphql",
    {
      method: "POST",
      headers: {
        "x-hasura-admin-secret":
          "pKafh99phI945uGqnYLetXE5ema0EY6neMjDbsBYiRRhnMHP4cg39txqdsodbFhd",
      },
      body: JSON.stringify({
        query: DELETE_OPERATION,
        variables,
      }),
    }
  );
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// UPDATE ONE

const executeUpdate = async (variables) => {
  const fetchResponse = await fetch(
    "https://mighty-hyena-98.hasura.app/v1/graphql",
    {
      method: "POST",
      headers: {
        "x-hasura-admin-secret":
          "pKafh99phI945uGqnYLetXE5ema0EY6neMjDbsBYiRRhnMHP4cg39txqdsodbFhd",
      },
      body: JSON.stringify({
        query: UPDATE_OPERATION,
        variables,
      }),
    }
  );
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

//CREATE ONE
const executeCreate = async (variables) => {
  const fetchResponse = await fetch(
    "https://mighty-hyena-98.hasura.app/v1/graphql",
    {
      method: "POST",
      headers: {
        "x-hasura-admin-secret":
          "pKafh99phI945uGqnYLetXE5ema0EY6neMjDbsBYiRRhnMHP4cg39txqdsodbFhd",
      },
      body: JSON.stringify({
        query: CREATE_OPERATION,
        variables,
      }),
    }
  );
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// INSERT ONE
app.post("/insertOne", async (req, res) => {
  // get request input
  const { name, email, mobile } = req.body;
  // execute the Hasura operation
  const { data, errors } = await executeCreate({ name, email, mobile });
  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }
  // success
  return res.json({
    ...data.insert_users_one,
  });
});

app.post("/getAll", async (req, res) => {
    // execute the Hasura operation
    const { data, errors } = await executeAll();
    console.log("in api call", JSON.stringify(data));
    // if Hasura operation errors, then throw error
    if (errors) {
      return res.status(400).json(errors[0]);
    }
    // success
    return res.json({
      ...data.users,
    });
  });

app.post("/updateUser", async (req, res) => {
    const { id, name, email } = req.body;
    // execute the Hasura operation
    const { data, errors } = await executeUpdate({ id, name, email });
    // if Hasura operation errors, then throw error
    if (errors) {
      return res.status(400).json(errors[0]);
    }
    // success
    return res.json({
      ...data.update_users,
    });
  });

app.post("/deleteUser", async (req, res) => {
    const { id } = req.body;  
    // execute the Hasura operation
    const { data, errors } = await executeDelete({ id });
    // if Hasura operation errors, then throw error
    if (errors) {
      return res.status(400).json(errors[0]);
    }
    // success
    return res.json({
      ...data.delete_users,
    });
  });

app.listen(PORT);
