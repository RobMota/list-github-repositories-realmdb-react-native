import React from "react";
import { eyboard, Keyboard } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import api from "~/services/api";
import getRealm from "~/services/realm";

import Repository from "~/components/Repository";

import { Container, Title, Form, Input, Submit, List } from "./styles";

export default function Main() {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState(false);
  const [repositories, setRepositories] = React.useState([]);

  React.useEffect(() => {
    async function loadRepositories() {
      const realm = await getRealm();
      const data = realm.objects("Repository").sorted("stars", true);

      setRepositories(data);
    }

    loadRepositories();
  }, []);

  async function saveRepository(repository) {
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };

    const realm = await getRealm();

    realm.write(() => {
      realm.create("Repository", data, "modified");
    });

    return data;
  }

  async function handleAddRepository() {
    try {
      const response = await api.get(`/repos/${input}`);
      await saveRepository(response.data);

      setInput("");
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      setError(true);
    }
  }

  async function handleRefreshRepository(repository) {
    const response = await api.get(`/repos/${repository.fullName}`);
    const data = await saveRepository(response.data);

    setRepositories(
      repositories.map((repo) => (repo.id === data.id ? data : repo))
    );
  }

  return (
    <Container>
      <Title>Repositórios</Title>
      <Form>
        <Input
          value={input}
          error={error}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Digite rocketseat/unform"
        />
        <Submit onPress={handleAddRepository}>
          <Icon name="add" size={22} color="#FFF" type="MaterialIcons" />
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={repositories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Repository
            data={item}
            onRefresh={() => handleRefreshRepository(item)}
          />
        )}
      />
    </Container>
  );
}
