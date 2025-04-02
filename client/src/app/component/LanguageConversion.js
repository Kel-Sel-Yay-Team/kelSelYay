const burmese = {
    // Modal Titles and Headers
    'Missing Person Details': 'ပျောက်ဆုံးသူ အချက်အလက်များ',
    'Edit Missing Person Details': 'ပျောက်ဆုံးသူ အသေးစိတ်အချက်အလက်များကို တည်းဖြတ်ပါ',
    'Verify Reporter Identity': 'သတင်းပေးပို့သူ၏ ကိုယ်ရေးအချက်အလက်များကို အတည်ပြုပါ',

    // Missing Person Button
    'Report Missing Person': 'လူပျောက်ကြေညာရန်',
    
    // Person Details
    'Name': 'အမည်',
    'Description': 'ဖော်ပြချက်',
    'Last Known Location': 'နောက်ဆုံးသိရှိခဲ့သော တည်နေရာ',
    'Missing Since': 'ပျောက်ဆုံးသည်မှ',
    'Reported By': 'သတင်းပို့သူ',
    'Contact Number': 'ဆက်သွယ်ရန်နံပါတ်',
    'No description provided': 'ဖော်ပြချက် မပေးထားပါ',
    'Unknown': 'မသိရှိရပါ',
    'No contact number provided': 'ဆက်သွယ်ရန် ဖုန်းနံပါတ် မပေးထားပါ',
    
    // Buttons
    'Edit': 'တည်းဖြတ်ရန်',
    'Save Changes': 'ပြောင်းလဲမှုများကို သိမ်းဆည်းရန်',
    'Cancel': 'ပယ်ဖျက်ရန်',
    'Close': 'ပိတ်ရန်',
    'Verify': 'အတည်ပြုရန်',
    'Saving...': 'သိမ်းဆည်းနေသည်...',
    'Report Sighting': 'တွေ့မြင်မှုကို သတင်းပို့ရန်',
    'Remove Report': 'သတင်းပို့ချက်ကို ဖယ်ရှားရန်',
    
    // Form placeholders & labels
    'Enter Name': 'အမည်ထည့်သွင်းပါ',
    'Enter Description': 'ဖော်ပြချက် ထည့်သွင်းပါ',
    'Enter Last Known Location': 'နောက်ဆုံးသိရှိရသော တည်နေရာကို ထည့်သွင်းပါ',
    'Enter Missing Since': 'မည်သည့်အချိန်မှစ၍ ပျောက်ဆုံးခဲ့သည်ကို ထည့်သွင်းပါ',
    'Enter Reported By': 'သတင်းပို့သူကို ထည့်သွင်းပါ', 
    'Enter Contact Number': 'ဆက်သွယ်ရန် ဖုန်းနံပါတ်ကို ထည့်သွင်းပါ',
    'Reporter name': 'သတင်းပို့သူအမည်',
    
    // Messages
    'Please enter the name of the person who originally reported this case:': 'ဤကိစ္စကို မူလတင်ပြခဲ့သူ၏ အမည်ကို ထည့်သွင်းပါ:',
    'Reporter name does not match our records. Please try again.': 'သတင်းပေးသူအမည်သည် ကျွန်ုပ်တို့၏မှတ်တမ်းများနှင့် ကိုက်ညီမှုမရှိပါ။ ထပ်စမ်းကြည့်ပါ။',
    'Are you sure you want to delete this report? This action cannot be undone.': 'ဤသတင်းပို့ချက်ကို ပယ်ဖျက်လိုသည်မှာ သေချာပါသလား? ဤလုပ်ဆောင်ချက်သည် နောင်တွင် ပြန်လည်ပြုပြင်၍မရနိုင်ပါ။',
    'Failed to update record': 'မှတ်တမ်းကို အပ်ဒိတ်လုပ်ရန် မအောင်မြင်ပါ',
    'Failed to delete report. Please try again.': 'သတင်းပို့ချက်ကို ဖယ်ရှားရန် မအောင်မြင်ပါ။ ထပ်စမ်းကြည့်ပါ။',
    'Failed to update information. Please try again.': 'အချက်အလက် အပ်ဒိတ်လုပ်ခြင်း မအောင်မြင်ပါ။ ထပ်စမ်းကြည့်ပါ။',
    
    // Image related
    'No Image Available': 'ပုံ မရရှိနိုင်ပါ',
    'Upload': 'တင်ပို့ရန်',

    //report missing person card
    'Missing Person\'s Name' : 'ပျောက်ဆုံးသူ၏အမည်',
    'Contact Number':'ဆက်သွယ်ရန်နံပါတ်',
    'Click to upload photo' : 'ဓာတ်ပုံတင်ရန် နှိပ်ပါ',
    'Reported By' :'သတင်းပေးပို့သူ',
    'Relation to Reporter' : 'သတင်းထောက်နှင့်စပ်လျဉ်း',
    'Time Since Missing (e.g. 24)' : 'ပျောက်ဆုံးနေသည့်အချိန်',
    'Last Known Location' : 'နောက်ဆုံးသိထားသောတည်နေရာ',
    'Description' : 'ဖော်ပြချက်',
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