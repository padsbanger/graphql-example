const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;


const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString }
  }
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve( parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(data => data.data)
      }
    }
  }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(data => data.data);
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery
});
