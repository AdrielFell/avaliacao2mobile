import { View, Text, Button, StyleSheet, FlatList, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, initDb } from "../data/db";

export default function TelaTreinos() {
    const [id, setId,] = useState("");
    const [atividade, setAtividade] = useState("");
    const [duracaominuto, setDuracaominuto] = useState("");
    const [categoria, setCategoria] = useState("");
    const [treinos, setTreinos] = useState([]);

    function getTreinos() {
        return db.getAllSync('SELECT * FROM treinos');
    }

    function getTreinoById(id) {
        const [treino] = db.getAllSync('SELECT * FROM treinos WHERE id = ?', [id]);
        return treino;
    }

    function killTreino() {
        return db.getAllSync('SELECT * FROM treinos');
    }

    function insertTreino(atividade, duracaominuto, categoria) {
        db.runSync('INSERT INTO treinos (atividade, duracaominuto, categoria) VALUES (?, ?, ?)', [atividade, duracaominuto, categoria]);
    }

    function updateTreino(id, atividade, duracaominuto, categoria) {
        db.runSync('UPDATE treinos SET atividade = ?, duracaominuto = ?, categoria = ? WHERE id = ?', [atividade, duracaominuto, categoria, id]);
    }

    function editaTreino(id) {
        setId(id);
        const treino = getTreinoById(id);
        if (!treino) return;
        preencheCampos(treino.atividade, treino.duracaominuto, treino.categoria);
    }

    function resetId() {
        setId(null);
        limpaCampos();
    }

    function carregarTreinos() {
        const dados = getTreinos();
        setTreinos(dados);
    }


    function salvarTreino(id) {
        const atv = atividade.trim();
        const val = parseFloat(duracaominuto);
        const cat = categoria.trim();

        if (!atv) {
            Alert.alert("Erro", "Descrição não pode estar vazia.");
            return;
        }

        if (isNaN(val) || val < 0) {
            Alert.alert("Erro", "Valor deve ser um número maior que zero minutos.");
            return;
        }

        if (!cat) {
            Alert.alert("Erro", "Descrição não pode estar vazia.");
            return;
        }

        if (!id) {
            insertTreino(atv, val, cat);

        } else { updateTreino(id, atv, val, cat); resetId() }

        limpaCampos();
    }

    function killTreino(id) {
        db.runSync('DELETE FROM treinos WHERE id = ?', [id]);
        carregarTreinos();
    }

    function limpaCampos() {
        setAtividade("");
        setDuracaominuto("");
        setCategoria("");
        carregarTreinos();
    }

    function preencheCampos(atividade, duracaominuto, categoria) {
        const atv = atividade.trim();
        const val = parseFloat(duracaominuto);
        const cat = categoria.trim();

        setAtividade(atv);
        setDuracaominuto(val);
        setCategoria(cat);
        carregarTreinos();
    }

    // Carrega as tarefas quando a tela abre
    useEffect(() => {
        // Carrega a database ao abrir o aplicativo
        initDb();
        // Executa uma única vez após o primeiro render
        carregarTreinos();
    }, []);

    return (
        <SafeAreaView style={styles.tela}>
            <Text style={styles.title}>Treinos</Text>

            <View style={styles.forms}>
                <TextInput
                    value={atividade}
                    onChangeText={setAtividade}
                    placeholder="Atividade"
                    style={styles.input}
                />
                <TextInput
                    value={duracaominuto}
                    onChangeText={setDuracaominuto}
                    placeholder="Duração Minuto"
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    value={categoria}
                    onChangeText={setCategoria}
                    placeholder="Categoria"
                    style={styles.input}
                />
                <Button title="Salvar" onPress={() => salvarTreino(id)} />
                <Button title="Cancelar" onPress={resetId} />
            </View>

            <Button title="Carregar treinos" onPress={carregarTreinos} />

            <FlatList
                data={treinos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        - {item.atividade} | Min {item.duracaominuto} | {item.categoria} | <Button title="Editar" onPress={() => editaTreino(item.id)} /> | <Button title="Excluir" onPress={() => killTreino(item.id)} />
                    </Text>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        padding: 16
    },
    forms: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
        flexWrap: "wrap"
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        minWidth: "40%"
    },
    item: {
        fontSize: 16,
        paddingVertical: 6
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8
    },
}
)