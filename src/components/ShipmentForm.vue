<template>
    <div class="card flex flex-col gap-4 w-full sm:w-96 p-4">
        <Toast />
        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit"
            class="flex flex-col gap-6">
            <!-- Sender Information -->
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-medium">Sender Information</h3>

                <InputText name="sender_name" type="text" placeholder="Full Name" fluid />
                <Message v-if="$form.sender_name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.sender_name.error?.message }}
                </Message>

                <InputText name="sender_street" type="text" placeholder="Street" fluid />
                <Message v-if="$form.sender_street?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.sender_street.error?.message }}
                </Message>

                <InputText name="sender_postal_code" type="text" placeholder="Postal Code" fluid />
                <Message v-if="$form.sender_postal_code?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.sender_postal_code.error?.message }}
                </Message>

                <InputText name="sender_city" type="text" placeholder="City" fluid />
                <Message v-if="$form.sender_city?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.sender_city.error?.message }}
                </Message>

                <InputText name="sender_country" type="text" placeholder="Country" fluid />
                <Message v-if="$form.sender_country?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.sender_country.error?.message }}
                </Message>
            </div>

            <!-- Receiver Information -->
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-medium">Receiver Information</h3>

                <InputText name="receiver_name" type="text" placeholder="Full Name" fluid />
                <Message v-if="$form.receiver_name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.receiver_name.error?.message }}
                </Message>

                <InputText name="receiver_street" type="text" placeholder="Street" fluid />
                <Message v-if="$form.receiver_street?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.receiver_street.error?.message }}
                </Message>

                <InputText name="receiver_postal_code" type="text" placeholder="Postal Code" fluid />
                <Message v-if="$form.receiver_postal_code?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.receiver_postal_code.error?.message }}
                </Message>

                <InputText name="receiver_city" type="text" placeholder="City" fluid />
                <Message v-if="$form.receiver_city?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.receiver_city.error?.message }}
                </Message>

                <InputText name="receiver_country" type="text" placeholder="Country" fluid />
                <Message v-if="$form.receiver_country?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.receiver_country.error?.message }}
                </Message>
            </div>

            <!-- Shipment Information -->
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-medium">Shipment Information</h3>
                <div class="flex items-center gap-2">
                    <InputText name="weight" type="number" placeholder="Weight" fluid />
                    <Dropdown name="weight_unit" :options="weightUnits" option-label="label" option-value="value"
                        placeholder="Unit" />
                </div>
                <Message v-if="$form.weight?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.weight.error?.message }}
                </Message>
            </div>

            <!-- Submit Button -->
            <Button type="submit" severity="primary" label="Calculate Price" />
        </Form>
    </div>
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
    weight_unit: 'kg',
});

const weightUnits = [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Grams (g)', value: 'g' },
];

const resolver = ({ values }) => {
    const errors = {};

    // Sender validations
    if (!values.sender_name) errors.sender_name = [{ message: 'Sender name is required.' }];
    if (!values.sender_street) errors.sender_street = [{ message: 'Sender street is required.' }];
    if (!values.sender_postal_code) errors.sender_postal_code = [{ message: 'Sender postal code is required.' }];
    if (!values.sender_city) errors.sender_city = [{ message: 'Sender city is required.' }];
    if (!values.sender_country) errors.sender_country = [{ message: 'Sender country is required.' }];

    // Receiver validations
    if (!values.reciever_name) errors.receiver_name = [{ message: 'Receiver name is required.' }];
    if (!values.receiver_street) errors.receiver_street = [{ message: 'Receiver street is required.' }];
    if (!values.receiver_postal_code) errors.receiver_postal_code = [{ message: 'Receiver postal code is required.' }];
    if (!values.receiver_city) errors.receiver_city = [{ message: 'Receiver city is required.' }];
    if (!values.receiver_country) errors.receiver_country = [{ message: 'Receiver country is required.' }];

    // Shipment validations
    if (!values.weight || values.weight <= 0) {
        errors.weight = [{ message: 'Weight is required.' }];
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
