import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api'

export default function App() {
  const [repositories, setRepositories] = useState([])

  async function handleLikeRepository(id) {
    const resp = await api.post(`repositories/${id}/like`)

    const updatedRepository = resp.data

    const newRepositories = repositories.map(repository => {
      return repository.id === id ? updatedRepository : repository
    })

    setRepositories(newRepositories)
  }

  async function handleAddNewRepository() {
    const nameNewRepository = `Repository - ${repositories.length+1}`

    const repository = await api.post('repositories', {
      title: nameNewRepository,
      url:"",
      technologies:[
        "NodeJS",
        "Middlewares",
        "Params"
      ]
    })

    setRepositories([...repositories, repository.data])
  }

  useEffect(() => {
    api.get('repositories').then((resp) => {
      setRepositories(resp.data)
    })
  }, [])

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text key={tech.id} style={styles.tech}>
                    {tech.techs}
                  </Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtida{repository.likes < 2 ? '' : 's'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.buttonNewRepository} onPress={handleAddNewRepository}>
          <Text style={styles.buttonNewRepositoryText}>Add Repository</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginTop: 15,
    marginBottom: 0,
    marginHorizontal: 15,
    backgroundColor: "#ddd",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },

  buttonNewRepository: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 4,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333'
  },

  buttonNewRepositoryText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    padding: 10,
  },
});
