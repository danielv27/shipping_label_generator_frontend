<template>
    <div class="card flex flex-col gap-4 w-full p-4">
        <Toast />
        <Form v-slot="$form" :resolver @submit="onFormSubmit" class="flex flex-col gap-6">
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
                <Select v-model="carrierService" name="carrier_service_id" :options="carrierServiceOptions"
                    :disabled="carrierFieldDisabled" option-label="label" option-value="value"
                    placeholder="Carrier Service" />
                <Message v-if="$form['carrier_service_id']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['carrier_service_id'].error?.message }}
                </Message>
                <div class="flex items-center gap-2">
                    <InputText v-model="weight" name="weight" type="number" placeholder="Weight" fluid />
                    <Select v-model="weightUnit" name="weight_unit" :options="weightUnits" option-label="label"
                        option-value="value" placeholder="Unit" />
                </div>
                <Message v-if="$form['weight']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['weight'].error?.message }}
                </Message>
            </div>
            <div v-if="price">Price is: {{ price }}</div>

            <!-- Submit Button -->
            <Button type="submit" severity="primary" label="Generate Label" />
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
import { debounce } from 'lodash';

const emit = defineEmits(['calculatePrice']);

const toast = useToast();

const countryOptions = ref([]);
const carrierServiceOptions = ref([]);

const senderCountry = ref('');
const receiverCountry = ref('');
const carrierService = ref('');
const weight = ref('');
const weightUnit = ref('kg');

const price = ref(undefined);

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

async function getCarrierServiceOptions(senderCountryCode: string, receiverCountryCode: string) {
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
}

const calculatePrice = debounce(async () => {
    if (carrierService.value && weight.value) {
        try {
            const response = await fetch('http://localhost:8000/api/pricing/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    carrier_service_id: carrierService.value,
                    sender_country_code: senderCountry.value,
                    receiver_country_code: receiverCountry.value,
                    weight: weight.value,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                price.value = data.price;
            } else {
                console.error('Failed to calculate price:', response.status);
            }
        } catch (error) {
            console.error('Error calculating price:', error);
        }
    }
}, 300); // Debounce delay in milliseconds


getCountryOptions();

watch([senderCountry, receiverCountry], ([senderCountryCode, receiverCountryCode]) => {
    getCarrierServiceOptions(senderCountryCode, receiverCountryCode)
});

watch([carrierService, weight], () => {
    calculatePrice();
});


const weightUnits = [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Grams (g)', value: 'g' },
];

const resolver = async ({ values }) => {

    const errors: Record<string, { message: string }[]> = {};

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
        errors.carrier_service_id = [{ message: 'Carrier Service is required. ' + (carrierFieldDisabled.value ? 'Fill in sender and receiver adresses first.' : '') }];
    }

    if (!values.weight) {
        errors.weight = [{ message: 'Weight is required.' }];
        price.value = undefined;
    }
    if (values.weight && values.weight <= 0) {
        errors.weight = [{ message: 'Weight must be positive.' }];
        price.value = undefined;
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
