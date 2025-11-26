import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, ActivityIndicator, Button, TextInput, Pressable, Alert, StyleSheet, Keyboard } from "react-native";

export default function GamesScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const API_URL = "http://177.44.248.50:8080/games";

  useEffect(() => { load(); }, []); 

  function limpaCampo() {
    setSelectedId(null);
    setTitle(""); 
    setSlug(""); 
    setPrice(""); 
    setDescription("");
    setDeveloper(""); 
    setPublisher(""); 
    setGenre(""); 
    setPlatform("");
    setReleaseDate("");
    Keyboard.dismiss();
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!title || !slug || !price) {
      Alert.alert("Atenção", "Preencha Título, Slug e Preço.");
      return;
    }

    setLoading(true);
    const method = selectedId ? "PUT" : "POST";
    const url = selectedId ? `${API_URL}/${selectedId}` : API_URL;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, price: parseFloat(price),
          description: description || "Sem descrição",
          developer: developer || "Desconhecido",
          publisher: publisher || "Desconhecida",
          genre: genre || "Outros",
          platform: platform || "Multi",
          release_date: releaseDate
        }),
      });

      if (res.ok) {
        Alert.alert("Sucesso", selectedId ? "Atualizado!" : "Cadastrado!");
        await load();
        limpaCampo();
      } else {
        Alert.alert("Erro", `Status: ${res.status}`);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão.");
    } finally {
      setLoading(false);
    }
  }

  async function deletar() {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${selectedId}`, { method: "DELETE" });
      if (res.ok) {
        Alert.alert("Sucesso", "Excluído!");
        await load();
        limpaCampo();
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao excluir.");
    } finally {
      setLoading(false);
    }
  }

  function editar(item) {
    setSelectedId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setPrice(String(item.price));
    setDescription(item.description || "");
    setDeveloper(item.developer || "");
    setPublisher(item.publisher || "");
    setGenre(item.genre || "");
    setPlatform(item.platform || "");
    setReleaseDate(item.release_date || "");
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gerenciador de Jogos</Text>

      {/* ÁREA DO FORMULÁRIO SIMPLIFICADA (Igual TelaTreinos) */}
      <View style={styles.formContainer}>
        <TextInput 
            value={title} onChangeText={setTitle} 
            placeholder="Título *" style={styles.input} 
        />
        <TextInput 
            value={slug} onChangeText={setSlug} 
            placeholder="Slug *" style={styles.input} autoCapitalize="none" 
        />
        <TextInput 
            value={price} onChangeText={setPrice} 
            placeholder="Preço *" style={styles.input} keyboardType="numeric" 
        />
        <TextInput 
            value={description} onChangeText={setDescription} 
            placeholder="Descrição" style={styles.input} 
        />
        <TextInput 
            value={developer} onChangeText={setDeveloper} 
            placeholder="Dev" style={styles.input} 
        />
        <TextInput 
            value={publisher} onChangeText={setPublisher} 
            placeholder="Publicadora" style={styles.input} 
        />
        <TextInput 
            value={genre} onChangeText={setGenre} 
            placeholder="Gênero" style={styles.input} 
        />
        <TextInput 
            value={platform} onChangeText={setPlatform} 
            placeholder="Plataforma" style={styles.input} 
        />
        <TextInput 
            value={releaseDate} onChangeText={setReleaseDate} 
            placeholder="YYYY-MM-DD" style={styles.input} 
        />
        
        <View style={styles.buttonContainer}>
           <Button title={selectedId ? "Atualizar" : "Salvar"} onPress={salvar} disabled={loading} />
           {selectedId && <Button title="Excluir" onPress={deletar} color="red" disabled={loading} />}
           {selectedId && <Button title="Cancelar" onPress={limpaCampo} color="gray" />}
        </View>
      </View>

      {loading && <ActivityIndicator size="small" color="#0000ff" />}

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum jogo cadastrado.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => editar(item)} style={[styles.item, item.id === selectedId && styles.selectedItem]}>
            <View style={{flex: 1}}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.platform} | {item.genre}</Text>
            </View>
            <Text style={styles.itemPrice}>R$ {item.price?.toFixed(2)}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },
  formContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
    justifyContent: "space-between"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#fff",
    minWidth: "30%",
    flexGrow: 1      
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 5,
    gap: 10
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  selectedItem: {
    borderColor: "#007bff",
    backgroundColor: "#eef6ff"
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16
  },
  itemSubtitle: {
    color: "#666",
    fontSize: 12
  },
  itemPrice: {
    fontWeight: "bold",
    color: "green"
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20
  }
});