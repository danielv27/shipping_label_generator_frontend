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

            <!-- Recipient Information -->
            <div class="flex flex-col gap-1">
                <h3 class="text-lg font-medium">Recipient Information</h3>

                <InputText name="recipient_name" type="text" placeholder="Full Name" fluid />
                <Message v-if="$form['recipient_name']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['recipient_name'].error?.message }}
                </Message>

                <InputText name="recipient_street" type="text" placeholder="Street" fluid />
                <Message v-if="$form['recipient_street']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['recipient_street'].error?.message }}
                </Message>

                <InputText name="recipient_postal_code" type="text" placeholder="Postal Code" fluid />
                <Message v-if="$form['recipient_postal_code']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['recipient_postal_code'].error?.message }}
                </Message>

                <InputText name="recipient_city" type="text" placeholder="City" fluid />
                <Message v-if="$form['recipient_city']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['recipient_city'].error?.message }}
                </Message>
                <Select v-model="recipientCountry" filter :options="countryOptions" name="recipient_country"
                    placeholder="Country" option-label="label" option-value="value">
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <span :class="`fi fi-${slotProps.option.value.toLowerCase()} mr-2`"></span>
                            <div>{{ slotProps.option.label }}</div>
                        </div>
                    </template>
                </Select>
                <Message v-if="$form['recipient_country']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['recipient_country'].error?.message }}
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
                    <InputText v-model.number="weight" name="weight" type="number" placeholder="Weight" fluid />
                    <Select v-model="weightUnit" name="weight_unit" :options="weightUnits" option-label="label"
                        option-value="value" placeholder="Unit" />
                </div>
                <Message v-if="$form['weight']?.invalid" severity="error" size="small" variant="simple">
                    {{ $form['weight'].error?.message }}
                </Message>
            </div>
            <div class="text-center text-xl" v-if="price">This shipment will cost {{ price }}€</div>

            <Button type="submit" severity="primary" label="Generate Label" />
        </Form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
const recipientCountry = ref('');
const carrierService = ref('');
const weight = ref(undefined);
const weightUnit = ref('kg');

const price = ref(undefined);

const carrierFieldDisabled = computed(() => Boolean(!senderCountry.value || !recipientCountry.value));

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

async function getCarrierServiceOptions(senderCountryCode: string, recipientCountryCode: string) {
    if (senderCountryCode && recipientCountryCode) {

        const urlParams = `sender_country_code=${senderCountryCode}&recipient_country_code=${recipientCountryCode}`;
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

// debounce prevents consecutive calls to the same endpoint (once a change is completed (e.g. typing, making selection) it makes a single request to the backend)
const calculatePrice = debounce(async () => {
    if (carrierService.value && weight.value) {
        const isKg = weightUnit.value === 'kg';
        const weightInKgs = isKg ? weight.value : (Math.ceil(weight.value) / 1000);
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
                    recipient_country_code: recipientCountry.value,
                    weight: weightInKgs,
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

watch([senderCountry, recipientCountry], ([senderCountryCode, recipientCountryCode]) => {
    getCarrierServiceOptions(senderCountryCode, recipientCountryCode)
});

watch([carrierService, weight, weightUnit], () => {
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

    // Recipient validations
    if (!values.recipient_name) errors.recipient_name = [{ message: 'Recipient name is required.' }];
    if (!values.recipient_street) errors.recipient_street = [{ message: 'Recipient street is required.' }];
    if (!values.recipient_postal_code) errors.recipient_postal_code = [{ message: 'Recipient postal code is required.' }];
    if (!values.recipient_city) errors.recipient_city = [{ message: 'Recipient city is required.' }];
    if (!values.recipient_country) errors.recipient_country = [{ message: 'Recipient country is required.' }];

    // Shipment validations
    if (!values.carrier_service_id) {
        errors.carrier_service_id = [{ message: 'Carrier Service is required. ' + (carrierFieldDisabled.value ? 'Fill in sender and recipient adresses first.' : '') }];
    }

    if (!values.weight) {
        errors.weight = [{ message: 'Weight is required.' }];
        price.value = undefined;
    }
    if (values.weight && values.weight <= 0) {
        errors.weight = [{ message: 'Weight must be greater than 0.' }];
        price.value = undefined;
    }
    return { errors };
};

function downloadPdfFromBlob(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipping-label.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function generateLabel(states) {
    try {
        const response = await fetch('http://localhost:8000/api/label/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf',
            },
            body: JSON.stringify({
                recipient_name: states.recipient_name.value,
                recipient_street: states.recipient_street.value,
                recipient_postal_code: states.recipient_postal_code.value,
                recipient_city: states.recipient_city.value,
                recipient_country: states.recipient_country.value,
                carrier_service_id: states.carrier_service_id.value,
            }),
        });

        if (response.ok) {
            downloadPdfFromBlob(await response.blob());
            toast.add({
                severity: 'success',
                summary: 'Label Generated',
                detail: 'The shipping label was generated successfully.',
                life: 3000,
            });
        } else {
            console.error(await response.json());
            errorToast();
        }
    } catch (error) {
        console.error('Error generating label:', error);
        errorToast();
    }

}

const onFormSubmit = ({ states, valid }) => {
    if (valid) {
        generateLabel(states);
    }
}
</script>
