import React ,{ useState, useEffect }from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet,TouchableOpacity,ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();
      if (data.result === 'success') {
        const currencyList = Object.keys(data.rates).map((currency) => ({
          label: currency,
          value: currency,
        }));
        setCurrencies(currencyList);
      } else {
        alert('Failed to fetch currency data');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching currency data.');
    }
  };
  const convertCurrency = async () => {
    if (!amount || !fromCurrency || !toCurrency) {
      alert('Please enter all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );
      const data = await response.json();
  
      if (data.result === 'success') {
        const rate = data.rates[toCurrency];
        const result = (amount * rate).toFixed(2);
        setConvertedAmount(result);
      } else {
        alert('Failed to convert currency');
      }
    } catch (error) {
      console.error(error);
      alert('Error during conversion.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>From Currency</Text>
        <RNPickerSelect  onValueChange={(value) =>setFromCurrency(value)}
          items={currencies}
          placeholder={{ label: 'Select currency', value: null }} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>To Currency</Text>
        <RNPickerSelect  onValueChange={(value) =>setToCurrency(value)}
          items={currencies}
          placeholder={{ label: 'Select currency', value: null }} />
      </View>
      // Add a button and display result in the return block
      <TouchableOpacity style={styles.button} onPress={convertCurrency}>
        <Text style={styles.buttonText}>Convert</Text>
      </TouchableOpacity>;
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {convertedAmount && (
        <Text style={styles.result}>
          Converted Amount: {convertedAmount} {toCurrency}
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default App;

