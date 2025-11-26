import { View, Button } from "react-native";
import { Link } from "expo-router";

export default function Home() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Link href="/gameVault" asChild>
          <Button title="Ir para Game Vault" />
        </Link>
      </View>
      
    );
}