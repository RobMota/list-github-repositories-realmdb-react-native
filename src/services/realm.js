import Realm from 'realm';

import RepositorySchema from '../Schema/RepositorySchema';

export default function getRealm() {
  return Realm.open({
    schema: [RepositorySchema],
  });
}
