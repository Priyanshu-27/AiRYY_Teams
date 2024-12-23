import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmergencyContact = ({
  userDetails,
  handleInputChange,
  handleAddEmergencyContact,
}) => {
  // Ensure userDetails.emergencyContacts is always an array
  const emergencyContacts = userDetails?.emergencyContacts || [];

  // State to handle error messages
  const [errorMessages, setErrorMessages] = useState({});

  // Function to validate input fields for each contact
  const validateInput = index => {
    const contact = emergencyContacts[index];
    let errors = {};

    // Validate emergencyName
    if (!contact.emergencyName || contact.emergencyName.trim() === '') {
      errors.emergencyName = 'Emergency name is required';
    }

    // Validate emergencyContact
    if (!contact.emergencyContact || contact.emergencyContact.trim() === '') {
      errors.emergencyContact = 'Emergency contact number is required';
    }

    // Validate emergencyRelation
    if (!contact.emergencyRelation) {
      errors.emergencyRelation = 'Emergency relation is required';
    }

    setErrorMessages(prevState => ({
      ...prevState,
      [index]: errors,
    }));

    // Return whether the current contact is valid
    return Object.keys(errors).length === 0;
  };

  // Handle text input change for each emergency contact
  const handleChange = (index, field, value) => {
    handleInputChange('emergencyContacts', index, field, value); // Update value in parent state
    validateInput(index); // Validate after each input change
  };

  // Handle the action to add a new emergency contact
  const handleAddContact = () => {
    // Validate all the emergency contacts before adding new one
    let allValid = true;
    emergencyContacts.forEach((_, index) => {
      if (!validateInput(index)) {
        allValid = false;
      }
    });

    // If all fields are valid, add a new emergency contact
    if (allValid) {
      handleAddEmergencyContact();
    } else {
      Alert.alert(
        'Error',
        'Please correct the errors before adding a new contact',
      );
    }
  };

  return (
    <View style={styles.emergencyContactContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity onPress={handleAddContact}>
          <Ionicons
            name="add-circle"
            size={30}
            color="#fbbf24"
            style={{backgroundColor: '#000', borderRadius: 50}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactContainer}>
            <TextInput
              placeholder={`Emergency Name ${index + 1}`}
              value={contact.emergencyName}
              onChangeText={text => handleChange(index, 'emergencyName', text)}
              style={styles.input}
              placeholderTextColor="#888"
            />
            {errorMessages[index]?.emergencyName && (
              <Text style={styles.errorText}>
                {errorMessages[index]?.emergencyName}
              </Text>
            )}

            <TextInput
              placeholder={`Emergency Contact Number ${index + 1}`}
              value={contact.emergencyContact}
              onChangeText={text =>
                handleChange(index, 'emergencyContact', text)
              }
              keyboardType="phone-pad"
              style={styles.input}
              placeholderTextColor="#888"
            />
            {errorMessages[index]?.emergencyContact && (
              <Text style={styles.errorText}>
                {errorMessages[index]?.emergencyContact}
              </Text>
            )}

            <RNPickerSelect
              onValueChange={value =>
                handleChange(index, 'emergencyRelation', value)
              }
              items={[
                {label: 'Friend', value: 'Friend'},
                {label: 'Family', value: 'Family'},
                {label: 'Colleague', value: 'Colleague'},
              ]}
              value={contact.emergencyRelation}
              placeholder={{label: 'Select Relationship', value: null}}
              style={pickerSelectStyles}
            />
            {errorMessages[index]?.emergencyRelation && (
              <Text style={styles.errorText}>
                {errorMessages[index]?.emergencyRelation}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emergencyContactContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  contactContainer: {
    marginBottom: 15,
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
  addButton: {
    backgroundColor: '#0F62FE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
};

export default EmergencyContact;