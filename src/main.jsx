import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function UserDetails() {
  const { userId } = useParams();
  const isCreate = !userId;
  const [user, setUser] = useState({});

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3001/api/users/${userId}`)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          throw err;
        });
    }
  }, [userId]);

  function handleChange(event) {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  }

  function handleSubmit() {
    axios
      .post("http://localhost:3001/api/users", user)
      .then(res => {
        alert(
          `${isCreate ? "Create" : "Edit"} user ${JSON.stringify(
            res.data
          )} successfully!!!`
        );
      })
      .catch(err => {
        throw err;
      });
  }

  return (
    <div>
      <h1>User details</h1>
      <form>
        <div>
          <label>Id</label>
          <input name="id" value={user.id || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Name</label>
          <input name="name" value={user.name || ""} onChange={handleChange} />
        </div>
        <div>
          <label>Birthday</label>
          <input
            type="date"
            name="birthday"
            value={user.birthday || ""}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );

}

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3001/api/users")
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => {
        throw err;
      });
  }

  handleCreate = () => {
    window.location.href = "/user/add";
  };

  render() {
    const { users } = this.state;
    return (
      <div>
        <h1>Users</h1>
        {users.map(user => (
          <div key={user.id}>
            <a href={`/user/${user.id}`}> {user.name} </a>
          </div>
        ))}
        <button type="button" onClick={this.handleCreate}>
          Create
        </button>
      </div>
    );
  }
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path={"/user/add"} element={<UserDetails />} />
        <Route path={`/user/:userId`} element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
  )
}



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
