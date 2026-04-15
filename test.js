const axios = require('axios');

axios.post('http://localhost:8080/api/auth/register', {
  name: "Rafael",
  email: "rafael@email.com",
  password: "password",
  role: "ROLE_USER"
})
.then(res => {
  console.log("SUCCESS:", res.status);
  console.log("DATA:", res.data);
})
.catch(err => {
  console.log("ERROR STATUS:", err.response ? err.response.status : "No Response");
  console.log("ERROR DATA:", err.response ? JSON.stringify(err.response.data) : err.message);
});
