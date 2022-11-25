const { usersTable, db } = require('../setup');
// roles => Member, EventManager
var users = {};

const doc = db.ref('users').on('value', async (snapshot) => {
  await loadUsers();
});

async function refreshUsers() {
  if ((events = {})) {
    await loadUsers();
  }
}

async function loadUsers() {
  try {
    await usersTable.once('value', async (snapshot) => {
      users = snapshot.val();
    });
  } catch (error) {
    console.log({
      status: false,
      message: `${error}`,
    });
  }
}

async function getUserInfo(uid, res) {
  try {
    if (uid in users) {
      return res.status(200).send({
        status: true,
        message: users[`${uid}`],
      });
    } else {
      return res.status(200).send({
        status: false,
        message: `no user with uid ${uid} found`,
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

// creates users when new account created
async function addUser(uid, name, email, res) {
  try {
    await refreshUsers();
    if (users != null && uid in users) {
      return res
        .status(200)
        .send({ status: true, message: `User wih uid ${uid} already exists` });
    } else {
      await usersTable.child(`${uid}`).set({
        name: name,
        email: email,
        roles: ['Member'],
      });
      return res
        .status(200)
        .send({ status: true, message: `User wih uid ${uid} Added` });
    }
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function addRole(uid, role, res) {
  try {
    await refreshUsers();
    if (uid in users) {
      const user = users[`${uid}`];
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
        res.status(200).send({
          status: false,
          message: `user with uid ${uid} already has role ${role}`,
        });
      }
    } else {
      res.status(200).send({
        status: false,
        message: `Could not find user with uid ${uid}`,
      });
    }
  } catch (error) {
    res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function removeRole(uid, role, res) {
  try {
    await refreshUsers();
    if (uid in users) {
      const user = users[`${uid}`];
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
        res.status(200).send({
          status: false,
          message: `user with uid ${uid} does not have the role ${role}`,
        });
      }
    } else {
      res.status(200).send({
        status: false,
        message: `Could not find user with uid ${uid}`,
      });
    }
  } catch (error) {
    res.status(400).send({
      status: false,
      message: `${error}`,
    });
  }
}

async function getRoles(uid) {
  try {
    await refreshUsers();
    var data = {
      status: false,
      roles: [],
    };
    if (uid in users) {
      data.status = true;
      data['roles'] = users[`${uid}`].roles;
    }
  } catch (error) {
    console.log(error);
  }
  return data;
}

async function hasPrevelige(uid, role) {
  try {
    await refreshUsers();
    const data = await getRoles(uid);
    var roles = data.roles;
    if (data.status == false) {
      return {
        status: false,
        message: `user with uid ${uid} does not exist`,
      };
    } else {
      roles = data.roles;
      if (roles == undefined) {
        roles = [];
      }
    }

    if (!roles.includes(`${role}`)) {
      return {
        status: false,
        message: `user with uid ${uid} does not have ${role} priveliges`,
      };
    }

    return {
      status: true,
      message: `user with uid ${uid} has ${role} priveliges`,
    };
  } catch (error) {
    return {
      status: false,
      message: `${error}`,
    };
  }
}

module.exports = {
  getUserInfo: getUserInfo,
  addUser: addUser,
  addRole: addRole,
  removeRole: removeRole,
  hasPrevelige: hasPrevelige,
};
