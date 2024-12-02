# Shipping Label Generator Frontend

This project is the frontend application for the [Shipping Label Generator](https://github.com/danielv27/shipping_label_generator).
This project was build in Vue using the [PrimeVue component library](https://primevue.org)

It allows users to input shipment details, calculate shipping prices dynamically, and generate shipping labels in PDF format.

## Features

- Input sender and recipient details, including name, address, and country.
- Dynamically fetch and display available carrier services based on sender and recipient countries.
- Calculate shipping prices based on weight and carrier service selection.
- Generate and download PDF shipping labels, including a machine-scannable barcode.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Run the development server:
   ```bash
   yarn dev
   ```
The application will be accessible at http://localhost:5173

## Usage

1. Fill in the sender and recipient details using the provided form.
2. Select a carrier service and enter the shipment weight.
3. View the calculated shipping price dynamically whenever the carrier service and/or weight change.
4. Submit the form to generate and download a shipping label in PDF format.



