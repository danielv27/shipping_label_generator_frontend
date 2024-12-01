<template>
  <ShipmentForm />
</template>

<script setup lang="ts">
import { reactive, defineEmits } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import ShipmentForm from '@components/ShipmentForm.vue'


const emit = defineEmits(['calculatePrice']);

const toast = useToast();

const initialValues = reactive({
  sender_street: '',
  sender_postal_code: '',
  sender_city: '',
  sender_country: '',
  receiver_street: '',
  receiver_postal_code: '',
  receiver_city: '',
  receiver_country: '',
  weight: '',
  weight_unit: 'kg', // Default to kilograms
});

const weightUnits = [
  { label: 'Kilograms (kg)', value: 'kg' },
  { label: 'Grams (g)', value: 'g' },
];

const resolver = ({ values }) => {
  const errors = {};

  // Sender validations
  if (!values.sender_street) errors.sender_street = [{ message: 'Sender street is required.' }];
  if (!values.sender_postal_code) errors.sender_postal_code = [{ message: 'Sender postal code is required.' }];
  if (!values.sender_city) errors.sender_city = [{ message: 'Sender city is required.' }];
  if (!values.sender_country) errors.sender_country = [{ message: 'Sender country is required.' }];

  // Receiver validations
  if (!values.receiver_street) errors.receiver_street = [{ message: 'Receiver street is required.' }];
  if (!values.receiver_postal_code) errors.receiver_postal_code = [{ message: 'Receiver postal code is required.' }];
  if (!values.receiver_city) errors.receiver_city = [{ message: 'Receiver city is required.' }];
  if (!values.receiver_country) errors.receiver_country = [{ message: 'Receiver country is required.' }];

  // Shipment validations
  if (!values.weight || values.weight <= 0) {
    errors.weight = [{ message: 'Weight must be a positive number.' }];
  }

  return { errors };
};

const onFormSubmit = ({ valid, values }) => {
  if (valid) {
    if (values.weight_unit === 'g') {
      values.weight = values.weight / 1000;
      values.weight_unit = 'kg';
    }
    emit('calculatePrice', values);
    toast.add({
      severity: 'success',
      summary: 'Details submitted.',
      life: 3000,
    });
  }
};
</script>
