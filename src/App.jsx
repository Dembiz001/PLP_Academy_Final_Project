import React, { useState, useRef } from 'react';
import { Upload, Leaf, AlertCircle, CheckCircle, Camera, Book, Droplets, Bug, Sun, MessageCircle, Bell, History, Trash2, Plus, Send, X } from 'lucide-react';

export default function GardeningAssistant() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [history, setHistory] = useState([]);
  const [newReminder, setNewReminder] = useState({ plantName: '', task: '', time: '' });
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Load data from storage on mount
  React.useEffect(() => {
    loadHistory();
    loadReminders();
  }, []);

  const loadHistory = async () => {
    try {
      const result = await window.storage.get('diagnosis-history');
      if (result) {
        setHistory(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No history found');
    }
  };

  const loadReminders = async () => {
    try {
      const result = await window.storage.get('watering-reminders');
      if (result) {
        setReminders(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No reminders found');
    }
  };

  const saveToHistory = async (diagnosisData) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      diagnosis: diagnosisData,
      imageUrl: previewUrl
    };
    const updatedHistory = [newEntry, ...history].slice(0, 20);
    setHistory(updatedHistory);
    try {
      await window.storage.set('diagnosis-history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const saveReminders = async (updatedReminders) => {
    try {
      await window.storage.set('watering-reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Failed to save reminders:', error);
    }
  };

  const plantConditions = {
    healthy: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      title: 'Healthy Plant',
      message: 'Your plant looks healthy and vibrant!',
      recommendations: [
        'Continue current watering schedule',
        'Ensure adequate sunlight (6-8 hours daily)',
        'Monitor for any changes in leaf color',
        'Apply balanced fertilizer monthly'
      ]
    },
    fungal: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      title: 'Fungal Infection Detected',
      message: 'Your plant shows signs of fungal disease.',
      recommendations: [
        'Remove affected leaves immediately',
        'Apply organic fungicide (neem oil solution)',
        'Reduce watering frequency - avoid wet leaves',
        'Improve air circulation around plant',
        'Avoid overhead watering'
      ]
    },
    pest: {
      icon: Bug,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      title: 'Pest Infestation',
      message: 'Pests detected on your plant.',
      recommendations: [
        'Spray with insecticidal soap or neem oil',
        'Remove visible pests manually',
        'Isolate plant from other plants',
        'Check undersides of leaves daily',
        'Consider beneficial insects (ladybugs)'
      ]
    },
    deficiency: {
      icon: Droplets,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      title: 'Nutrient Deficiency',
      message: 'Your plant may lack essential nutrients.',
      recommendations: [
        'Apply balanced NPK fertilizer (10-10-10)',
        'Add compost to improve soil quality',
        'Check soil pH (most plants prefer 6.0-7.0)',
        'Consider foliar feeding for quick results',
        'Ensure proper drainage'
      ]
    },
    overwatering: {
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      title: 'Overwatering',
      message: 'Your plant shows signs of too much water.',
      recommendations: [
        'Allow soil to dry between waterings',
        'Improve drainage in pot/soil',
        'Remove any standing water',
        'Check roots for rot',
        'Reduce watering frequency by 50%'
      ]
    }
  };

  const plantLibrary = [
    {
      name: 'Tomato',
      icon: '🍅',
      light: 'Full sun (6-8 hours)',
      water: '1-2 inches per week',
      tips: 'Support with stakes, prune suckers',
      season: 'Warm season'
    },
    {
      name: 'Lettuce',
      icon: '🥬',
      light: 'Partial shade',
      water: 'Keep soil moist',
      tips: 'Harvest outer leaves first',
      season: 'Cool season'
    },
    {
      name: 'Pepper',
      icon: '🌶️',
      light: 'Full sun',
      water: 'Deep water weekly',
      tips: 'Mulch to retain moisture',
      season: 'Warm season'
    },
    {
      name: 'Carrot',
      icon: '🥕',
      light: 'Full sun',
      water: 'Regular, consistent',
      tips: 'Thin seedlings early',
      season: 'Cool season'
    },
    {
      name: 'Basil',
      icon: '🌿',
      light: 'Full sun',
      water: 'Keep moist, not wet',
      tips: 'Pinch flowers to promote growth',
      season: 'Warm season'
    },
    {
      name: 'Cucumber',
      icon: '🥒',
      light: 'Full sun',
      water: 'Consistent, deep watering',
      tips: 'Trellis for better growth',
      season: 'Warm season'
    },
    {
      name: 'Cabbage',
      icon: '🥬',
      light: 'Full sun to partial shade',
      water: '1.5 inches per week',
      tips: 'Fertilize every 2 weeks',
      season: 'Cool season'
    },
    {
      name: 'Onion',
      icon: '🧅',
      light: 'Full sun',
      water: 'Regular, reduce at maturity',
      tips: 'Pull back soil as bulbs grow',
      season: 'Cool season'
    },
    {
      name: 'Potato',
      icon: '🥔',
      light: 'Full sun',
      water: '1-2 inches per week',
      tips: 'Hill soil around plants',
      season: 'Cool season'
    },
    {
      name: 'Spinach',
      icon: '🥬',
      light: 'Full sun to partial shade',
      water: 'Keep consistently moist',
      tips: 'Harvest before bolting',
      season: 'Cool season'
    },
    {
      name: 'Beans',
      icon: '🫘',
      light: 'Full sun',
      water: 'Regular, increase at flowering',
      tips: 'Support pole varieties',
      season: 'Warm season'
    },
    {
      name: 'Corn',
      icon: '🌽',
      light: 'Full sun',
      water: 'Deep watering 1-2x weekly',
      tips: 'Plant in blocks for pollination',
      season: 'Warm season'
    },
    {
      name: 'Eggplant',
      icon: '🍆',
      light: 'Full sun',
      water: 'Deep weekly watering',
      tips: 'Support heavy fruits',
      season: 'Warm season'
    },
    {
      name: 'Squash',
      icon: '🥒',
      light: 'Full sun',
      water: 'Deep watering weekly',
      tips: 'Hand pollinate if needed',
      season: 'Warm season'
    },
    {
      name: 'Pumpkin',
      icon: '🎃',
      light: 'Full sun',
      water: 'Deep watering weekly',
      tips: 'Space plants 3-5 feet apart',
      season: 'Warm season'
    },
    {
      name: 'Radish',
      icon: '🥬',
      light: 'Full sun to partial shade',
      water: 'Keep soil moist',
      tips: 'Fast growing, harvest early',
      season: 'Cool season'
    },
    {
      name: 'Garlic',
      icon: '🧄',
      light: 'Full sun',
      water: 'Moderate, stop before harvest',
      tips: 'Plant cloves in fall',
      season: 'Cool season'
    },
    {
      name: 'Broccoli',
      icon: '🥦',
      light: 'Full sun',
      water: '1-1.5 inches per week',
      tips: 'Side shoots after main harvest',
      season: 'Cool season'
    },
    {
      name: 'Kale',
      icon: '🥬',
      light: 'Full sun to partial shade',
      water: 'Keep consistently moist',
      tips: 'Sweeter after frost',
      season: 'Cool season'
    },
    {
      name: 'Peas',
      icon: '🫛',
      light: 'Full sun',
      water: 'Regular during pod formation',
      tips: 'Support with trellis',
      season: 'Cool season'
    },
    {
      name: 'Beets',
      icon: '🥬',
      light: 'Full sun',
      water: 'Regular, consistent',
      tips: 'Thin seedlings to 3-4 inches',
      season: 'Cool season'
    },
    {
      name: 'Sweet Potato',
      icon: '🍠',
      light: 'Full sun',
      water: 'Regular, deep watering',
      tips: 'Long growing season (100+ days)',
      season: 'Warm season'
    },
    {
      name: 'Cauliflower',
      icon: '🥬',
      light: 'Full sun',
      water: '1-1.5 inches per week',
      tips: 'Tie leaves over head to blanch',
      season: 'Cool season'
    },
    {
      name: 'Zucchini',
      icon: '🥒',
      light: 'Full sun',
      water: 'Deep watering 2x weekly',
      tips: 'Harvest young for best flavor',
      season: 'Warm season'
    }
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setDiagnosis(null);
    }
  };

  const analyzePlant = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setDiagnosis(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: selectedImage.type,
                      data: base64Image
                    }
                  },
                  {
                    type: 'text',
                    text: `Analyze this plant image and determine its health condition. Respond with ONLY ONE of these exact words: healthy, fungal, pest, deficiency, or overwatering. Base your assessment on visible signs like leaf color, spots, wilting, discoloration, or pest damage.`
                  }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        const result = data.content[0].text.trim().toLowerCase();
        
        const validConditions = ['healthy', 'fungal', 'pest', 'deficiency', 'overwatering'];
        const condition = validConditions.includes(result) ? result : 'fungal';
        
        const diagnosisResult = plantConditions[condition];
        setDiagnosis(diagnosisResult);
        saveToHistory(diagnosisResult);
        setLoading(false);
      };

      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Analysis error:', error);
      setLoading(false);
      alert('Analysis failed. Please try again.');
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `You are a helpful gardening assistant. Answer this gardening question concisely and practically: ${chatInput}`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setChatLoading(false);

      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Chat error:', error);
      setChatLoading(false);
    }
  };

  const addReminder = () => {
    if (!newReminder.plantName || !newReminder.task || !newReminder.time) return;

    const reminder = {
      id: Date.now(),
      ...newReminder,
      created: new Date().toISOString()
    };

    const updatedReminders = [...reminders, reminder];
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
    setNewReminder({ plantName: '', task: '', time: '' });
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  };

  const clearHistory = async () => {
    setHistory([]);
    try {
      await window.storage.delete('diagnosis-history');
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Gardening Assistant</h1>
              <p className="text-sm text-gray-600">Powered by AI • Supporting SDG 2, 11, 13</p>
            </div>
          </div>
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
          >
            <Book className="w-4 h-4" />
            Plant Library
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReminders(!showReminders)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              <Bell className="w-4 h-4" />
              Reminders
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Plant Library Modal */}
        {showLibrary && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Plant Care Library</h2>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantLibrary.map((plant, idx) => (
                <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="text-4xl mb-2">{plant.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{plant.name}</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-600" />
                      <span>{plant.light}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span>{plant.water}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 italic">{plant.tips}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminders Panel */}
        {showReminders && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Watering & Care Reminders</h2>
              <button
                onClick={() => setShowReminders(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Reminder</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Plant name"
                  value={newReminder.plantName}
                  onChange={(e) => setNewReminder({...newReminder, plantName: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Task (e.g., Water, Fertilize)"
                  value={newReminder.task}
                  onChange={(e) => setNewReminder({...newReminder, task: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addReminder}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {reminders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No reminders set. Add your first reminder above!</p>
              ) : (
                reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-800">{reminder.plantName}</p>
                        <p className="text-sm text-gray-600">{reminder.task} at {reminder.time}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Diagnosis History</h2>
              <div className="flex gap-2">
                <button
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-700 text-sm transition"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No diagnosis history yet. Start by analyzing a plant!</p>
              ) : (
                history.map((entry) => (
                  <div key={entry.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{entry.diagnosis.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${entry.diagnosis.bgColor} ${entry.diagnosis.color}`}>
                        {entry.diagnosis.title.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Plant Image</h2>
            <p className="text-gray-600 mb-6">Take a clear photo of your plant's leaves for best results</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-green-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Camera className="w-16 h-16 mx-auto text-green-600" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">Click to upload image</p>
                    <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={analyzePlant}
              disabled={!selectedImage || loading}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Analyze Plant Health
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Diagnosis & Care Tips</h2>

            {!diagnosis && !loading && (
              <div className="text-center py-12 text-gray-500">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Upload a plant image to receive instant diagnosis and care recommendations</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Analyzing your plant...</p>
              </div>
            )}

            {diagnosis && (
              <div className="space-y-6 animate-fadeIn">
                <div className={`${diagnosis.bgColor} rounded-lg p-6 border-l-4 border-${diagnosis.color.split('-')[1]}-600`}>
                  <div className="flex items-start gap-3">
                    <diagnosis.icon className={`w-8 h-8 ${diagnosis.color} flex-shrink-0`} />
                    <div>
                      <h3 className={`text-xl font-bold ${diagnosis.color} mb-1`}>
                        {diagnosis.title}
                      </h3>
                      <p className="text-gray-700">{diagnosis.message}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    {diagnosis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Pro Tip:</strong> Take photos in natural daylight for more accurate diagnoses. Regular monitoring helps catch issues early!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6 border border-green-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Instant Diagnosis</h3>
            <p className="text-sm text-gray-600">AI-powered plant health analysis in seconds</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-green-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Expert Recommendations</h3>
            <p className="text-sm text-gray-600">Get actionable care tips for any plant issue</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-green-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Grow Confidently</h3>
            <p className="text-sm text-gray-600">Support for gardeners at every skill level</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <p>🌱 Supporting SDG 2 (Zero Hunger), SDG 11 (Sustainable Cities), SDG 13 (Climate Action)</p>
          <p className="mt-2">Created by Demba Danso • PLP AI Gardening Project</p>
        </footer>
      </div>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chatbot Panel */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-green-100 flex flex-col z-50">
          <div className="bg-green-600 text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              <h3 className="font-bold">Gardening Assistant</h3>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Ask me anything about gardening!</p>
                <p className="text-xs mt-2">Try: "How often should I water tomatoes?"</p>
              </div>
            )}

            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask a gardening question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || chatLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}