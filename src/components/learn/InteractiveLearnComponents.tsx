import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download,
  ChevronLeft,
  ChevronRight,
  Calculator,
  BookOpen,
  Video,
  FileText,
  Headphones,
  Interactive
} from 'lucide-react';

// Interactive Video Player Component
interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration?: string;
  chapters?: { time: number; title: string }[];
}

export const InteractiveVideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  duration,
  chapters = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const jumpToChapter = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative bg-black">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                className="hover:bg-white/20 p-2 rounded transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-sm">{duration}</span>
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hover:bg-white/20 p-2 rounded transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        
        {/* Chapter Navigation */}
        {chapters.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Chapters:</h4>
            <div className="space-y-1">
              {chapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => jumpToChapter(chapter.time)}
                  className="flex items-center justify-between w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                >
                  <span>{chapter.title}</span>
                  <span className="text-gray-500">{Math.floor(chapter.time / 60)}:{(chapter.time % 60).toString().padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Interactive Formula Explorer
interface FormulaExplorerProps {
  formula: string;
  variables: { symbol: string; description: string; defaultValue?: number; unit?: string }[];
  onCalculate: (values: Record<string, number>) => number;
}

export const InteractiveFormulaExplorer: React.FC<FormulaExplorerProps> = ({
  formula,
  variables,
  onCalculate
}) => {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    variables.forEach(variable => {
      initial[variable.symbol] = variable.defaultValue || 0;
    });
    return initial;
  });

  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const calculatedResult = onCalculate(values);
    setResult(calculatedResult);
  }, [values, onCalculate]);

  const updateValue = (symbol: string, value: number) => {
    setValues(prev => ({ ...prev, [symbol]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <Calculator className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Interactive Formula Explorer</h3>
      </div>
      
      <div className="bg-white p-4 rounded-lg mb-4">
        <code className="text-lg font-mono text-blue-600">{formula}</code>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {variables.map((variable) => (
          <div key={variable.symbol} className="bg-white p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {variable.symbol} - {variable.description}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={values[variable.symbol]}
                onChange={(e) => updateValue(variable.symbol, parseFloat(e.target.value) || 0)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
              />
              {variable.unit && (
                <span className="text-sm text-gray-500">{variable.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-green-100 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-green-800 font-medium">Result:</span>
          <span className="text-2xl font-bold text-green-900">{result.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Interactive Slideshow Component
interface SlideshowProps {
  slides: {
    title: string;
    content: React.ReactNode;
    image?: string;
    animation?: 'fade' | 'slide' | 'zoom';
  }[];
}

export const InteractiveSlideshow: React.FC<SlideshowProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative h-96 bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-6 flex flex-col justify-center"
          >
            {slides[currentSlide].image && (
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {slides[currentSlide].title}
            </h3>
            <div className="text-gray-700">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Slide Controls */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                isAutoPlay 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isAutoPlay ? 'Pause' : 'Auto Play'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Multimedia Resource Library
interface MultimediaResource {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'document' | 'interactive';
  url: string;
  duration?: string;
  description: string;
  thumbnail?: string;
}

interface MultimediaLibraryProps {
  resources: MultimediaResource[];
}

export const MultimediaLibrary: React.FC<MultimediaLibraryProps> = ({ resources }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Headphones className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'interactive': return <Interactive className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const resourceTypes = [
    { value: 'all', label: 'All Resources' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Documents' },
    { value: 'interactive', label: 'Interactive' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Multimedia Learning Resources</h3>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {resourceTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      
      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {resource.thumbnail && (
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-blue-600">
                  {getTypeIcon(resource.type)}
                  <span className="text-sm font-medium capitalize">{resource.type}</span>
                </div>
                {resource.duration && (
                  <span className="text-xs text-gray-500">{resource.duration}</span>
                )}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <span>Access Resource</span>
                <Download className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No resources found matching your criteria.
        </div>
      )}
    </div>
  );
};
