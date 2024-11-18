import React, {useState, useEffect} from 'react';
import {DOMAIN} from '@env';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';

const CustomCheckBox = ({value, onValueChange}) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={styles.checkboxContainer}>
      <Ionicons
        name={value ? 'checkbox-outline' : 'square-outline'}
        size={24}
        color="#000"
      />
    </TouchableOpacity>
  );
};

const CarDetail = () => {
     const navigation = useNavigation();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [carDetails, setCarDetails] = useState({
    fuelType: '',
    KM_Now: '',
    carReadingImage: null,
  });
  const [rentalType, setRentalType] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [rentalDuration, setRentalDuration] = useState('');
  const [advancePayment, setAdvancePayment] = useState(false);
  const [depositPayment, setDepositPayment] = useState(false);
  const [advanceUPI, setAdvanceUPI] = useState('');
  const [advanceCash, setAdvanceCash] = useState('');
  const [depositUPI, setDepositUPI] = useState('');
  const [depositCash, setDepositCash] = useState('');


  const handleCarSelect = car => {
    if (car) {
      setSelectedCar(car.modelName || 'Unknown Model');
      setCarDetails({
        fuelType: car.fuelType || '',
        KM_Now: car.KM_Now || 0,
        carReadingImage: null,
      });
    }
  };



  const [CarData, setCarData] = useState([]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      fetch(`https://${DOMAIN}/Car/carids/`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(responseJson => {
          setCarData(responseJson);
          setCars(responseJson);
        })
        .catch(error => {
          console.log(error);
        });
    });
   
    return focusHandler;
  }, [CarData, navigation, refreshing]);


  const openCamera = () => {
    launchCamera({}, response => {
      if (response.assets) {
        const imageUri = response.assets[0].uri;
        const imageName =
          response.assets[0].fileName || imageUri.split('/').pop();
        setCarDetails(prevDetails => ({
          ...prevDetails,
          carReadingImage: {uri: imageUri, name: imageName},
        }));
      }
    });
  };

 const handleSubmit = () => {
   if (selectedCar) {
     Alert.alert(
       'Car Rental Confirmation',
       `You have given the car ${selectedCar} to the user.`,
       [
         {
           text: 'OK',
           onPress: () => navigation.navigate('CarHome'),
         },
       ],
     );
   } else {
     Alert.alert('Error', 'Please select a car before submitting.');
   }
 };



  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#eff6ff',
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            borderRadius: 20,
            elevation: 1,
          }}>
          <Text style={{color: '#000', fontWeight: 'bold', fontSize: 25}}>
            Car Detail
          </Text>
        </View>

        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Select Car</Text>
          <RNPickerSelect
            onValueChange={handleCarSelect}
            items={cars}
            placeholder={{label: 'Select a Car', value: null}}
            style={pickerSelectStyles}
          />

          <TextInput
            placeholder="Fuel Type"
            value={carDetails.fuelType}
            editable={false}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="KM Now"
            value={String(carDetails.KM_Now)}
            editable={false}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <View style={styles.uploadBtnContainer}>
            <TouchableOpacity style={styles.button} onPress={openCamera}>
              <Text style={styles.buttonText}>Capture Car Reading</Text>
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color="#fff"
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
            {carDetails.carReadingImage && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.imageLabel}>Uploaded</Text>
                <Image
                  source={{uri: carDetails.carReadingImage.uri}}
                  style={styles.uploadedImage}
                />
              </View>
            )}
          </View>
        </View>

        {/* Rental Type Section */}
        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Rental Type</Text>
          <RNPickerSelect
            onValueChange={value => setRentalType(value)}
            items={[
              {label: 'Hourly', value: 'hour'},
              {label: 'Daily', value: 'day'},
              {label: 'Monthly', value: 'month'},
            ]}
            placeholder={{label: 'Select Rental Type', value: null}}
            style={pickerSelectStyles}
          />

          {rentalType && (
            <TextInput
              placeholder={`Enter ${
                rentalType === 'hour'
                  ? 'KM'
                  : rentalType === 'day'
                  ? 'Days'
                  : 'Months'
              }`}
              value={rentalDuration}
              onChangeText={setRentalDuration}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          )}
        </View>

        {/* Advance Payment Section */}
        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Advance Payment</Text>
          <CustomCheckBox
            value={advancePayment}
            onValueChange={setAdvancePayment}
          />
          {advancePayment && (
            <>
              <TextInput
                placeholder="Advance UPI Payment"
                value={advanceUPI}
                onChangeText={setAdvanceUPI}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Advance Cash Payment"
                value={advanceCash}
                onChangeText={setAdvanceCash}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </>
          )}
        </View>

        {/* Deposit Payment Section */}
        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Deposit Payment</Text>
          <CustomCheckBox
            value={depositPayment}
            onValueChange={setDepositPayment}
          />
          {depositPayment && (
            <>
              <TextInput
                placeholder="Deposit UPI Payment"
                value={depositUPI}
                onChangeText={setDepositUPI}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Deposit Cash Payment"
                value={depositCash}
                onChangeText={setDepositCash}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </>
          )}
        </View>
      </View>
      {/* Submit Button */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
        }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  carSelectionContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  input: {
    color: '#000',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#172554',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  uploadBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imageLabel: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 9,
  },
  uploadedImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  checkboxContainer: {
    marginVertical: 10,
  },

  submitButton: {
    backgroundColor: '#86efac',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
    borderRadius: 15,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

const pickerSelectStyles = {
  inputAndroid: {
    color: '#000',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#888',
  },
};

export default CarDetail;
