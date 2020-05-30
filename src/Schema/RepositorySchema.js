export default class RespositorySchema {
  static schema = {
    name: 'Repository',
    primaryKey: 'id',
    properties: {
      id: {
        type: 'int',
        indexed: true,
      },
      fullName: 'string',
      name: 'string',
      description: 'string',
      stars: 'int',
      forks: 'int',
    },
  };
}
