
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      header: { title: "Smart Stock Manager" },
      fileUpload: {
        title: "Upload Your Supermarket Data",
        description: "Drag and drop your CSV file here or click to browse. The file should contain a header row with column names. The AI will adapt to your data structure.",
        browse: "Browse File",
        processing: "Processing...",
        error: "Invalid or empty CSV file. Please ensure it has a header row and comma-separated values.",
        exampleTitle: "CSV Format Example:",
        exampleContent: "ProductID,ProductName,Category,Price,InStock,MonthlySales\n101,Organic Milk,Dairy,4.50,150,800\n203,Avocado,Produce,1.99,200,1200\n..."
      },
      dashboard: {
        tabManage: "Stock Management",
        tabAnalyze: "AI Analyst",
        chatTitle: "AI Analyst Chat",
        newFile: "Upload New File",
        you: "You",
        ai: "AI",
        analyzing: "Analyzing...",
        placeholder: "Ask about your products...",
        initialGreeting: "Hello! I've successfully loaded your file \"{{fileName}}\". You can manage your stock in the 'Stock Management' tab or ask me questions here. \n\nHere are some questions you could ask:\n• What are the top 5 best-selling items?\n• Show me a breakdown by category.\n• Which products are low in stock?\n• Give me a table of all products from a specific supplier.",
        error: "I'm sorry, but I encountered an error. Please try again."
      },
      stockManager: {
        searchPlaceholder: "Search products...",
        exportCsv: "Export CSV"
      },
      visualization: {
        noData: "Not enough data to display visualization.",
        unsupported: "Unsupported visualization type."
      },
      errors: {
        analysisFailed: "Sorry, I encountered an error while analyzing the data. Please check the console for details or try a different question."
      }
    }
  },
  fr: {
    translation: {
      header: { title: "Gestionnaire de Stock Intelligent" },
      fileUpload: {
        title: "Téléchargez vos Données de Supermarché",
        description: "Glissez-déposez votre fichier CSV ici ou cliquez pour parcourir. Le fichier doit contenir une ligne d'en-tête avec les noms de colonnes. L'IA s'adaptera à votre structure de données.",
        browse: "Parcourir",
        processing: "Traitement...",
        error: "Fichier CSV invalide ou vide. Veuillez vous assurer qu'il contient une ligne d'en-tête et des valeurs séparées par des virgules.",
        exampleTitle: "Exemple de Format CSV :",
        exampleContent: "IDProduit,NomProduit,Catégorie,Prix,EnStock,VentesMensuelles\n101,Lait Bio,Produits Laitiers,4.50,150,800\n203,Avocat,Fruits & Légumes,1.99,200,1200\n..."
      },
      dashboard: {
        tabManage: "Gestion de Stock",
        tabAnalyze: "Analyste IA",
        chatTitle: "Chat avec l'Analyste IA",
        newFile: "Nouveau Fichier",
        you: "Vous",
        ai: "IA",
        analyzing: "Analyse en cours...",
        placeholder: "Posez une question sur vos produits...",
        initialGreeting: "Bonjour ! J'ai bien chargé votre fichier \"{{fileName}}\". Vous pouvez gérer votre stock dans l'onglet 'Gestion de Stock' ou me poser des questions ici. \n\nVoici quelques questions que vous pourriez poser :\n• Quels sont les 5 articles les plus vendus ?\n• Montrez-moi une répartition par catégorie.\n• Quels produits ont un stock faible ?\n• Donnez-moi un tableau de tous les produits d'un fournisseur spécifique.",
        error: "Désolé, j'ai rencontré une erreur. Veuillez réessayer."
      },
      stockManager: {
        searchPlaceholder: "Rechercher des produits...",
        exportCsv: "Exporter en CSV"
      },
      visualization: {
        noData: "Pas assez de données pour afficher la visualisation.",
        unsupported: "Type de visualisation non pris en charge."
      },
      errors: {
        analysisFailed: "Désolé, j'ai rencontré une erreur lors de l'analyse des données. Veuillez vérifier la console pour plus de détails ou essayer une autre question."
      }
    }
  },
  ar: {
    translation: {
      header: { title: "مدير المخزون الذكي" },
      fileUpload: {
        title: "قم بتحميل بيانات السوبر ماركت الخاصة بك",
        description: "اسحب وأفلت ملف CSV الخاص بك هنا أو انقر للتصفح. يجب أن يحتوي الملف على صف رأس بأسماء الأعمدة. سيتكيف الذكاء الاصطناعي مع هيكل بياناتك.",
        browse: "تصفح الملفات",
        processing: "جاري المعالجة...",
        error: "ملف CSV غير صالح أو فارغ. يرجى التأكد من أنه يحتوي على صف رأس وقيم مفصولة بفواصل.",
        exampleTitle: "مثال على تنسيق CSV:",
        exampleContent: "معرف المنتج,اسم المنتج,الفئة,السعر,في المخزون,المبيعات الشهرية\n101,حليب عضوي,ألبان,4.50,150,800\n203,أفوكادو,منتجات زراعية,1.99,200,1200\n..."
      },
      dashboard: {
        tabManage: "إدارة المخزون",
        tabAnalyze: "محلل الذكاء الاصطناعي",
        chatTitle: "محادثة مع محلل الذكاء الاصطناعي",
        newFile: "تحميل ملف جديد",
        you: "أنت",
        ai: "الذكاء الاصطناعي",
        analyzing: "جاري التحليل...",
        placeholder: "اسأل عن منتجاتك...",
        initialGreeting: "أهلاً بك! لقد قمت بتحميل ملفك \"{{fileName}}\" بنجاح. يمكنك إدارة مخزونك في علامة التبويب 'إدارة المخزون' أو طرح الأسئلة علي هنا. \n\nإليك بعض الأسئلة التي يمكنك طرحها:\n• ما هي أفضل 5 منتجات مبيعًا؟\n• أرني توزيعًا حسب الفئة.\n• ما هي المنتجات التي أوشكت على النفاد من المخزون؟\n• أعطني جدولاً بجميع المنتجات من مورد معين.",
        error: "عذراً، لقد واجهت خطأ. يرجى المحاولة مرة أخرى."
      },
      stockManager: {
        searchPlaceholder: "ابحث عن المنتجات...",
        exportCsv: "تصدير كملف CSV"
      },
      visualization: {
        noData: "لا توجد بيانات كافية لعرض التمثيل البصري.",
        unsupported: "نوع التمثيل البصري غير مدعوم."
      },
      errors: {
        analysisFailed: "عذراً، لقد واجهت خطأ أثناء تحليل البيانات. يرجى التحقق من وحدة التحكم للحصول على التفاصيل أو تجربة سؤال مختلف."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <App />
    </React.Suspense>
  </React.StrictMode>
);