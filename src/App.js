import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";

const assetsSameDepth = {
  assets: {
      assetsConnection: {
          edges: [
              {
                  node: {
                      id: '3',
                      assets: {
                          assetsConnection: {
                              edges: [{
                                  node: { id: '4' },
                              }]
                          }
                      }
                  }
              },
              {
                  node: {
                      id: '1',
                      assets: {
                          assetsConnection: {
                              edges: [{
                                  node: { id: '4' },
                              }]
                          }
                      }
                  },
              }
          ],
      }
  }
};

const assetsDifferentDepth = {
  assets: {
      assetsConnection: {
          edges: [
              {
                  node: {
                      id: '7',
                      assets: {
                          assetsConnection: {
                              edges: [{
                                  node: { id: '4' },
                              }]
                          }
                      }
                  }
              },
              {
                  node: {
                      id: '100',
                  },
              }
          ],
      }
  }
}; 

export const AssetsDocument = gql`
    query Assets($input: AssetsInput!) {
      assets(input: $input) {
        assetsConnection {
          edges {
            node {
              id
              assets {
                assetsConnection {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
`;

const assetsMocks = [
  {
      request: {
          query: AssetsDocument,
          variables: { id: 0 },
      },
      result: {
          data: {
              ...assetsSameDepth,
          },
      },
  },
  {
    request: {
        query: AssetsDocument,
        variables: { id: 1 },
    },
    result: {
        data: {
            ...assetsDifferentDepth,
        },
    },
},
];

export default () => (
  <MockedProvider mocks={assetsMocks}>
    <App />
  </MockedProvider>
);

function App() {
  const [id, setId] = useState(1);
  const response = useQuery(AssetsDocument, { variables: { id }});

  console.log(id);
  console.log(response);

  return (
    <main>
      {response.data ? 'We have data' : 'No data'}
      <button onClick={() => setId(id => (id + 1) % 2)}>Change mocked asset</button>
    </main>
  );
}
