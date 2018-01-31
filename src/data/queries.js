export const getVariantInfos = id => `
{
    Variant(id: "${id}") {
        values
        family {
            template
        }
    }
  }
`;

export const getPrototypoUser = userEmail => `
    query {
        User (
            email: "${userEmail}"
        ) {
            id
        }
    }
`;

export const authenticateUser = (email, password) => `
    mutation {
        authenticateEmailUser(
            email:"${email}"
            password:"${password}"
        )
        {
            token
        }
    }
`;


export const getUserProjects = graphQLID => `
    query {
        User(
            id: "${graphQLID}"
        )
        {
            library {
                name
                id
                variants {
                    name
                    id
                }
            }
        }
    }
`;
