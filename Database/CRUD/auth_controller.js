const { usersTable } = require('../setup');

// creates users when new account created
async function addUser(uid, name, email, res) {
  try {
    await usersTable.child(`${uid}`).set({
      name: name,
      email: email,
      roles: ['member'],
    });
    return res
      .status(200)
      .send({ status: true, message: `User wih uid ${uid} Added` });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function addRole(uid, role, res) {
  try {
    usersTable.child(`${uid}`).once('value', async (snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.val();
        var roles = user.roles;
        if (roles == undefined) {
          roles = [];
        }
        if (!roles.includes(role)) {
          roles.push(role);
          const jsonPath = `${uid}/roles`;
          await usersTable.update({ [jsonPath]: roles });
          res.status(200).send({
            status: true,
            message: `successfully added the ${role} role to ${uid}`,
          });
        } else {
          res.status(400).send({
            status: false,
            message: `user with uid ${uid} already has role ${role}`,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: `Could not find user with uid ${uid}`,
        });
      }
    });
  } catch (e) {
    // throw error;
    res.status(400).send({
      status: false,
      message: `${e}`,
    });
  }
}

async function removeRole(uid, role, res) {
  try {
    usersTable.child(`${uid}`).once('value', async (snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.val();
        var roles = user.roles;
        if (roles == undefined) {
          roles = [];
        }
        if (roles.includes(role)) {
          roles.pop(roles.indexOf(role));
          const jsonPath = `${uid}/roles`;
          await usersTable.update({ [jsonPath]: roles });
          res.status(200).send({
            status: true,
            message: `successfully removed the ${role} role from ${uid}`,
          });
        } else {
          res.status(400).send({
            status: false,
            message: `user with uid ${uid} does not have the role ${role}`,
          });
        }
      } else {
        res.status(400).send({
          status: false,
          message: `Could not find user with uid ${uid}`,
        });
      }
    });
  } catch (e) {
    // throw error;
    res.status(400).send({
      status: false,
      message: `${e}`,
    });
  }
}

async function getRoles(uid) {
  data = {
    status: false,
    roles: [],
  };
  try {
    await usersTable.child(`${uid}`).once('value', async (snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.val();

        var roles = user.roles;
        data.status = true;
        if (roles == undefined) {
          roles = [];
        }
        data.roles = roles;
      }
    });
  } catch (error) {
    console.log(error);
  }
  return data;
}

async function hasPrevelige(uid, role) {
  try {
    const data = await getRoles(uid);
    var roles = [];
    // roles returns undefined
    console.log(data);
    if (data['status'] == false) {
      return {
        status: false,
        message: `user with uid ${uid} does not exist`,
      };
    } else {
      roles = data.roles;
    }

    if (!roles.includes(`${role}`)) {
      return {
        status: false,
        message: `user with uid ${uid} does not have event priveliges`,
      };
    }

    return {
      status: true,
      message: 'success',
    };
  } catch (error) {
    return {
      status: false,
      message: `${error}`,
    };
  }
}

module.exports = {
  addUser: addUser,
  addRole: addRole,
  removeRole: removeRole,
  getRoles: getRoles,
  hasPrevelige: hasPrevelige,
};

//   const s = usersTable
//     .orderByChild('name')
//     .equalTo('heee')
//     .on('value', function (snapshot) {
//       console.log(snapshot.val());
//     });

// try {

// } catch (e) {
//   // throw error;
//   res.status(400).send({
//     status: false,
//     message: `${e}`,
//   });
// }
