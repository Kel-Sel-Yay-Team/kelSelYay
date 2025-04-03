const burmese = {
  // Modal Titles and Headers
  'Missing Person Details': 'ပျောက်ဆုံးသူ၏အချက်အလက်',
  'Edit Missing Person Details': 'ပျောက်ဆုံးသူ အချက်အလက် ပြန်ပြင်ခြင်း',
  'Verify Reporter Identity': 'သတင်းပို့သူ၏ အမည်အတည်ပြုခြင်း',

  // Missing Person Button
  'Report Missing Person': 'လူပျောက်ကြေညာခြင်း',
  
  // Person Details
  'Name': 'အမည်',
  'Description': 'ဖော်ပြချက်',
  'Last Known Location': 'နောက်ဆုံးသိရှိခဲ့သော တည်နေရာ',
  'Missing Since': 'ပျောက်ဆုံးသည်မှကြာချိန်(နေ့)',
  'Reported By': 'သတင်းပို့သူ',
  'Contact Number': 'ဆက်သွယ်ရန်နံပါတ်',
  'No description provided': 'ဖော်ပြချက် မပေးထားပါ',
  'Unknown': 'မသိရှိရပါ',
  'No contact number provided': 'ဆက်သွယ်ရန် ဖုန်းနံပါတ် မပေးထားပါ',
  
  // Buttons
  'Edit': 'ပြင်ဆင်ရန်',
  'Save Changes': 'ပြောင်းလဲမှုများ အတည်ပြုရန်',
  'Cancel': 'ဖျက်ရန်',
  'Close': 'ပိတ်ရန်',
  'Verify': 'အတည်ပြုရန်',
  'Saving...': 'သိမ်းဆည်းနေသည်...',
  'Report Sighting': 'တွေ့မြင်မှုကို သတင်းပို့ရန်',
  'Remove Report': 'ဖျက်ရန်',
  'Donate' : 'လှူရန်',
  
  // Form placeholders & labels & units
  'Enter Name': 'အမည်ရေးရန်',
  'Enter Description': 'ဖော်ပြချက်',
  'Enter Last Known Location': 'နောက်ဆုံးသိရှိခဲ့သောနေရာ',
  'Enter Missing Since': 'ပျောက်ဆုံးသည်မှကြာချိန်(နေ့)',
  'Enter Reported By': 'သတင်းပို့သူကို ထည့်သွင်းပါ', 
  'Enter Contact Number': 'ဆက်သွယ်ရန် ဖုန်းနံပါတ်ကို ထည့်သွင်းပါ',
  'Reporter name': 'သတင်းပို့သူအမည်',
  
  // Messages
  'Please enter the name of the person who originally reported this case:': 'မူလသတင်းပေးပို့သူ၏ အမည်ကို ထည့်သွင်းရန်',
  'Reporter name does not match our records. Please try again.': 'သတင်းပေးသူအမည် ကျွန်ုပ်တို့၏မှတ်တမ်းများနှင့် ကိုက်ညီမှုမရှိပါ။ ထပ်စမ်းကြည့်ပါ။',
  'Are you sure you want to delete this report? This action cannot be undone.': 'ဖျက်လိုသည်မှာ သေချာပါသလား? (နောင်တွင် ပြန်လည်ပြုပြင်၍မရနိုင်ပါ။)',
  'Failed to update record': 'မအောင်မြင်ပါ',
  'Failed to delete report. Please try again.': 'ဖယ်ရှားခြင်း မအောင်မြင်ပါ။ ထပ်စမ်းကြည့်ပါ။',
  'Failed to update information. Please try again.': 'အချက်အလက် ပြင်ဆင်ခြင်း မအောင်မြင်ပါ။ ထပ်စမ်းကြည့်ပါ။',
  
  // Image related
  'No Image Available': 'ပုံမရရှိနိုင်ပါ',
  'Upload': 'ပုံတင်ရန်',

  //report missing person card
  'Missing Person\'s Name' : 'ပျောက်ဆုံးသူ၏အမည်',
  'Contact Number':'ဆက်သွယ်ရန်နံပါတ်',
  'Click to upload photo' : 'ဓာတ်ပုံတင်ရန် နှိပ်ပါ',
  'Reported By' :'သတင်းပေးပို့သူအမည်',
  'Relation to Reporter' : 'သတင်းပို့သူနှင့်တော်စပ်ပုံ',
  'Time Since Missing (e.g. 24)' : 'ပျောက်ဆုံးသည်မှကြာချိန်(နေ့)',
  'Time Since Missing' : 'ပျောက်ဆုံးနေချိန်မှ',
  'Last Known Location' : 'နောက်ဆုံးသိထားသောနေရာ',
  'Description' : 'ဖော်ပြချက်',
  'Submit':'တင်မည်',
  'Close':'ပိတ်မည်',

  //units
  'Days' : 'ရက်',

  //onBoarding
  'Step 1 — Map Overview': 'အဆင့် 1 — မြေပုံအကျဉ်းချုပ်',
  
  
};
  
  const english = {
    // Just use the key directly for English
  };
  
  export function translate(text, language = 'en') {
    if (language === 'my') {
      return burmese[text] || text; // Return Burmese translation or fallback to provided English text
    }
    return text; // Default: return English
  }
  
  // A simple hook for using translations
  export function useTranslation() {
    const [language, setLanguage] = useState('en');
    
    const t = useCallback((text) => translate(text, language), [language]);
    
    const toggleLanguage = () => {
      setLanguage(prev => prev === 'en' ? 'my' : 'en');
    };
    
    return { t, language, setLanguage, toggleLanguage };
  }