
# Smart Stock Manager 🛒

A powerful, AI-enhanced tool designed for supermarket owners and managers to directly manage their inventory and understand their data without needing technical skills. Upload your data, manage stock levels, and ask questions in plain language!

<img width="1504" height="685" alt="image" src="https://github.com/user-attachments/assets/6bdf07cb-e218-4517-b69d-7aa8885b2471" />


## What is this?

The Smart Stock Manager is your personal data and inventory expert. It has two primary functions:

1.  **Stock Management**: It takes a standard product file (like a CSV from your inventory system) and displays it in an interactive table. You can search, sort, and directly edit stock quantities. When you're done, you can export your updated data as a new CSV file.
2.  **AI Analyst**: It lets you chat with an AI that understands your data. You can quickly get insights, identify trends, and make better business decisions based on your live inventory data. Any changes you make in the stock manager are immediately reflected in the AI's analysis.

For example, you can:
- View your entire product list and search for specific items.
- Click on a stock number, change it, and see the update instantly.
- Ask the AI: "What are my top 5 best-selling products?"
- Ask: "Which items are running low on stock?" (based on your latest edits)
- Ask: "Show me a breakdown of sales by category."

The AI will answer you in plain text and even create charts and tables to make the data easier to understand.

## Key Features

- **Simple File Upload**: Securely upload your product data in the common CSV format.
- **Interactive Stock Table**: View, search, and sort your product data with ease.
- **Direct Stock Editing**: Click and edit stock levels directly in the table.
- **Export to CSV**: Download your modified inventory data with a single click.
- **AI-Powered Chat**: Ask questions in plain English, French, or Arabic and get instant answers based on your current data.
- **Voice Search**: Ask questions using your voice in English, French, or Arabic for a hands-free experience.
- **Automatic Visualizations**: The AI automatically creates bar charts, pie charts, and tables to visualize your data.
- **Multi-Language Support**: The entire interface and the AI's responses work in English, French, and Arabic.
- **Secure & Private**: Your API key is stored securely in your browser for your session only, and your data is not saved by this application.

---

## How to Use This App: A Step-by-Step Guide

Follow these three steps to get started. The first step is a one-time setup that takes about 5-10 minutes.

### Step 1: Get Your Google AI API Key (A one-time setup)

To use the powerful AI, you need a key, which is like a password that gives the app access to Google's AI brain.

1.  **Create the Key**:
    *   Go to Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    *   Click **"Create API key in new project"**.
    *   Copy the key that appears on your screen. **Save this key somewhere safe**, like in a password manager or a private document. You'll need it in a moment.

2.  **Enable Billing**:
    *   Google Cloud requires billing to be enabled to use the API, but they offer a generous free tier, so you likely won't be charged for normal use.
    *   Go to the Google Cloud Billing page: [https://console.cloud.google.com/billing](https://console.cloud.google.com/billing)
    *   Select the project you just created (it will have a name like "Generative Language Client...").
    *   Follow the instructions to link or create a billing account if you don't already have one.

3.  **Enable the AI Service**:
    *   This is like flipping a switch to turn on the specific AI service we need.
    *   Go to the Generative Language API page: [https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)
    *   Make sure the correct project is selected at the top of the page.
    *   Click the **"Enable"** button.

You're done with the technical part! You only need to do this once.

### Step 2: Prepare Your Supermarket Data

The AI reads data from a **CSV (Comma-Separated Values)** file. This is a very common format that you can easily export from most spreadsheet programs like Microsoft Excel or Google Sheets.

**Your CSV file MUST have:**
1.  A **header row** at the top that describes each column (e.g., `ProductID`, `ProductName`, `Category`, `Price`, `StockQuantity`).
2.  Data where values are separated by commas.

To create this file:
- In **Google Sheets**, go to `File > Download > Comma-separated values (.csv)`.
- In **Microsoft Excel**, go to `File > Save As` and choose `CSV (Comma delimited)` from the format dropdown.

### Step 3: Manage and Analyze Your Data!

Now for the easy part.
1.  **Open the Smart Stock Manager app** in your web browser.
2.  The app will first ask for your **API Key**. Paste the key you saved from Step 1.
3.  You will see the **file upload screen**. Click "Browse File" and select the CSV file you prepared in Step 2.
4.  **That's it!** The app will load your data into an interactive table.
    *   Use the **"Stock Management"** tab to view, search, and edit your stock levels.
    *   Switch to the **"AI Analyst"** tab to start asking questions about your data in the chat box.

---

## Your Data Privacy

We take your privacy seriously.
- Your API key is stored **only in your browser** for the current session. It is never sent to our servers. If you close your browser tab, you will need to enter it again.
- Your CSV data is sent directly to the Google AI model for analysis and is **not stored or logged** by this application.

## Troubleshooting

- **"Authentication Failed" Error**: If the app shows an error about your API key, please double-check the three parts of **Step 1**. The most common issues are:
    1.  Billing is not enabled on your Google Cloud project.
    2.  The "Generative Language API" was not enabled.
    3.  The API key was copied incorrectly.
- **File Upload Error**: If your file doesn't upload, please ensure it is a valid `.csv` file with a header row, as described in **Step 2**.
