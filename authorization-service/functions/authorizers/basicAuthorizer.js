exports.handler = async (event, context, callback) => {
  if(event['type'] != 'TOKEN'){
    return callback('Unauthorized');
  }

  try{
    const {authorizationToken, methodArn} = event;
    const encodedCridentials = authorizationToken.split(' ')[1];
    const buffer = Buffer.from(encodedCridentials, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');
    const storedUserPassword = process.env[username];
    const principalId = (username) ? Buffer.from(username).toString('base64') : 'Access denied';
    const effect = (storedUserPassword && storedUserPassword === password) ? 'Allow' : 'Deny';
    const policy =  generatePolicy(principalId, methodArn, effect);
    console.log(policy);
    return callback(null, policy);
  }
  catch(error){
    return callback('Unauthorized',error.message);
  }
}

const generatePolicy = (principalId, resource, effect = 'Allow') => {
  return {
     principalId,
     policyDocument: {
      Version: '2012-10-17',
      Statement: {
        Action: '*',
        Effect: effect,
        Resource: resource
      }
     }
  }
}
// Action: 'exexute-api:Invoke',

