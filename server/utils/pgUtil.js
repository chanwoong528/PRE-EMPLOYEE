var pgUtil = {};

/**
 * 
 * @param {*} pool 
 * @param {*} email 
 * @param {*} cb 
 * @returns cb callback
 */
pgUtil.selectLocalUserCB = (pool, email, cb) => {
  connect(pool, getLocalUserSelectQuery(email), (err, result) => {
    return cb (err, result);
  });
};

pgUtil.selectOauthUserCB = (pool, username, cb) => {
  const query = {
    name: 'select-from-oauth-users',
    text: `SELECT * FROM oauth_users WHERE username=$1`,
    values: [username],
  };
  connect(pool, query, (err, result, data) => {
    return cb (err, result, data);
  });
};

connect = async (pool, query, cb) => {
  pool().connect((err, client, release) => {
    if (err) cb(err);
    client.query(query, (err, result) => {
      release();
      if (err) cb(err);
      if (!result.rows[0]) return cb(null, false, { status:406, msg:"No such user found." });
      else {
        // const { password, ...user } = result.rows[0];
        return cb(null, result.rows[0]);
      }
    });
  });
};

pgUtil.insertLocalUserCB = (pool, email, password, firstname, lastname, position, cb) => {
  pool().query(getLocalUserInsertQuery(email, password, firstname, lastname, position),
  (err, result) => {
    if (err) return cb(err);
    if (result) return cb(null, true);
    else return cb(null, false, { status:500, msg: "DB insert: could not complete operation." });
  });
};

pgUtil.selectLocalUser = async (pool, email) => {
  const { rows } = await pool().query(getLocalUserSelectQuery(email));
  return rows[0];
};

pgUtil.selectOauthUser = async (pool, username) => {
  const { rows } = await pool().query(getOauthUserSelectQuery(username));
  return rows[0];
}

pgUtil.insertLocalUser = async (pool, email, password, firstname, lastname, position) => {
  const result = await pool().query(getLocalUserInsertQuery(email, password, firstname, lastname, position));
  return result ? true : false;
};

pgUtil.insertOauthUser = async (pool, user) => {
  const result = await pool().query(getOauthUserInsertQuery(user));
  return result ? true : false;
}

pgUtil.insertAndSelectOauthUser = async (pool, user) => {
  await pgUtil.insertOauthUser(pool, user);
  return await pgUtil.selectOauthUser(pool, user.username);
}

module.exports = pgUtil;


// Query Builders

getLocalUserSelectQuery = (email) => {
  return {
    name: 'select-from-local-users',
    text: `SELECT * FROM pre_emp_users WHERE email=$1`,
    values: [ email ],
  };
};

getOauthUserSelectQuery = (username) => {
  return {
    name: 'select-from-oauth-users',
    text: `SELECT * FROM oauth_users WHERE username=$1`,
    values: [ username ],
  };
};

getLocalUserInsertQuery = (email, password, firstname, lastname, position) => {
  return {
    name: 'insert-into-default-users',
    text: `INSERT INTO public.pre_emp_users(
      email, password, firstname, lastname, "position", created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, TO_CHAR(NOW(),'YYYY-MM-DD'), TO_CHAR(NOW(),'YYYY-MM-DD'))`,
    values: [email, password, firstname, lastname, position ? position.join(",") : "" ],
  };
};

getOauthUserInsertQuery = (user) => {
  return {
    name: 'insert-into-oauth-users',
    text: `INSERT INTO public.oauth_users(
      provider, username, firstname, lastname, "position", created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, TO_CHAR(NOW(),'YYYY-MM-DD'), TO_CHAR(NOW(),'YYYY-MM-DD'))`,
    values: [ user.provider, user.username, user.firstname, user.lastname, "" ],
  }
}