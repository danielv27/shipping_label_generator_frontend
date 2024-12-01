<template>
    <div class="card flex flex-col gap-4 w-full p-4">
        <Toast />
        <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="flex flex-col gap-6">
            <!-- Sender Information -->
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-medium">Sender Information</h3>

                <InputText name="sender_name" type="text" placeholder="Full Name" fluid />
                <Message v-if="$form['sender_name']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['sender_name'].error?.message }}
                </Message>

                <InputText name="sender_street" type="text" placeholder="Street" fluid />
                <Message v-if="$form['sender_street']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['sender_street'].error?.message }}
                </Message>

                <InputText name="sender_postal_code" type="text" placeholder="Postal Code" fluid />
                <Message v-if="$form['sender_postal_code']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['sender_postal_code'].error?.message }}
                </Message>

                <InputText name="sender_city" type="text" placeholder="City" fluid />
                <Message v-if="$form['sender_city']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['sender_city'].error?.message }}
                </Message>

                <Select v-model="senderCountry" filter :options="countryOptions" name="sender_country"
                    placeholder="Country" option-label="label" option-value="value">

                    <template #option="slotProps">
                        <div class="flex items-center">
                            <span :class="`fi fi-${slotProps.option.value.toLowerCase()} mr-2`"></span>
                            <div>{{ slotProps.option.label }}</div>
                        </div>
                    </template>
                </Select>
                <Message v-if="$form['sender_country']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['sender_country'].error?.message }}
                </Message>
            </div>

            <!-- Receiver Information -->
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-medium">Receiver Information</h3>

                <InputText name="receiver_name" type="text" placeholder="Full Name" fluid />
                <Message v-if="$form['receiver_name']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['receiver_name'].error?.message }}
                </Message>

                <InputText name="receiver_street" type="text" placeholder="Street" fluid />
                <Message v-if="$form['receiver_street']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['receiver_street'].error?.message }}
                </Message>

                <InputText name="receiver_postal_code" type="text" placeholder="Postal Code" fluid />
                <Message v-if="$form['receiver_postal_code']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['receiver_postal_code'].error?.message }}
                </Message>

                <InputText name="receiver_city" type="text" placeholder="City" fluid />
                <Message v-if="$form['receiver_city']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['receiver_city'].error?.message }}
                </Message>
                <Select v-model="receiverCountry" filter :options="countryOptions" name="receiver_country"
                    placeholder="Country" option-label="label" option-value="value">
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <span :class="`fi fi-${slotProps.option.value.toLowerCase()} mr-2`"></span>
                            <div>{{ slotProps.option.label }}</div>
                        </div>
                    </template>
                </Select>
                <Message v-if="$form['receiver_country']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['receiver_country'].error?.message }}
                </Message>
            </div>

            <!-- Shipment Information -->
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-medium">Shipment Information</h3>
                <Select name="carrier_service_id" :options="carrierServiceOptions" :disabled="carrierFieldDisabled"
                    option-label="label" option-value="value" placeholder="Carrier Service" />
                <Message v-if="$form['carrier_service_id']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['carrier_service_id'].error?.message }}
                </Message>
                <div class="flex items-center gap-2">
                    <InputText name="weight" type="number" placeholder="Weight" fluid />
                    <Select name="weight_unit" :options="weightUnits" option-label="label" option-value="value"
                        placeholder="Unit" />
                </div>
                <Message v-if="$form['weight']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['weight'].error?.message }}
                </Message>
            </div>

            <!-- Submit Button -->
            <Button type="submit" severity="primary" label="Calculate Price" />
        </Form>
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { Form } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import Select from 'primevue/select';

const emit = defineEmits(['calculatePrice']);

const toast = useToast();

interface ShipmentFormData {
    sender_name?: string;
    sender_street?: string;
    sender_postal_code?: string;
    sender_city?: string;
    sender_country?: string;
    receiver_name?: string;
    receiver_street?: string;
    receiver_postal_code?: string;
    receiver_city?: string;
    receiver_country?: string;
    weight?: number | string;
    carrier_service_id: string;
    weight_unit: string;
}

const initialValues: ShipmentFormData = {
    sender_name: '',
    sender_street: '',
    sender_postal_code: '',
    sender_city: '',
    sender_country: '',
    receiver_name: '',
    receiver_street: '',
    receiver_postal_code: '',
    receiver_city: '',
    receiver_country: '',
    weight: '',
    carrier_service_id: '',
    weight_unit: 'kg', // Default value
};


const countryOptions = ref([]);
const carrierServiceOptions = ref([]);


const senderCountry = ref('');
const receiverCountry = ref('');

const carrierFieldDisabled = computed(() => Boolean(!senderCountry.value || !receiverCountry.value));

function errorToast() {
    toast.add({
        severity: 'error',
        summary: 'Something went wrong.',
        life: 3000,
    });
}

async function getCountryOptions() {
    try {
        const res = await fetch('http://localhost:8000/api/countries');
        if (res.ok) {
            const data = await res.json();
            countryOptions.value = data.map(({ name, code }) => ({ label: name, value: code }));
        }
    } catch (error) {
        console.error('Fetch error:', error);
        errorToast();
    }
}

getCountryOptions();

watch([senderCountry, receiverCountry], async ([senderCountryCode, receiverCountryCode]) => {
    if (senderCountryCode && receiverCountryCode) {

        const urlParams = `source_country_code=${senderCountryCode}&destination_country_code=${receiverCountryCode}`;
        try {
            const res = await fetch(`http://localhost:8000/api/carrier-services?${urlParams}`);
            if (res.ok) {
                const data = await res.json();
                carrierServiceOptions.value = data.map(({ name, id }) => ({ label: name, value: id }));
            } else {
                console.error('Error fetching carrier services:', res.status);
                errorToast();
            }
        } catch (error) {
            console.error('Fetch error:', error);
            errorToast();
        }
    }
});



const weightUnits = [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Grams (g)', value: 'g' },
];

const resolver = async ({ values }) => {
    type Errors = Partial<Record<keyof ShipmentFormData, { message: string }[]>>;
    const errors: Errors = {};

    // Sender validations
    if (!values.sender_name) errors.sender_name = [{ message: 'Sender name is required.' }];
    if (!values.sender_street) errors.sender_street = [{ message: 'Sender street is required.' }];
    if (!values.sender_postal_code) errors.sender_postal_code = [{ message: 'Sender postal code is required.' }];
    if (!values.sender_city) errors.sender_city = [{ message: 'Sender city is required.' }];
    if (!values.sender_country) errors.sender_country = [{ message: 'Sender country is required.' }];

    // Receiver validations
    if (!values.receiver_name) errors.receiver_name = [{ message: 'Receiver name is required.' }];
    if (!values.receiver_street) errors.receiver_street = [{ message: 'Receiver street is required.' }];
    if (!values.receiver_postal_code) errors.receiver_postal_code = [{ message: 'Receiver postal code is required.' }];
    if (!values.receiver_city) errors.receiver_city = [{ message: 'Receiver city is required.' }];
    if (!values.receiver_country) errors.receiver_country = [{ message: 'Receiver country is required.' }];

    // Shipment validations
    if (!values.carrier_service_id) {
        errors.carrier_service_id = [{ message: 'Carrier Service is required. ' + (carrierFieldDisabled.value ? 'Fill in source and destination adresses first' : '') }];
    }

    if (!values.weight) {
        errors.weight = [{ message: 'Weight is required.' }];
    }
    if (values.weight && values.weight <= 0) {
        errors.weight = [{ message: 'Weight must be positive.' }];
    }
    return { errors };
};

const onFormSubmit = ({ states, valid }) => {
    if (valid) {
        toast.add({
            severity: 'success',
            summary: 'Details submitted.',
            life: 3000,
        });
    }
}
</script>
