import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import Select from '../../ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Microscope, Zap, Target, Settings } from 'lucide-react';

interface BeamQualityCalculatorFormProps {
  onCalculate: (inputs: any) => void;
  isLoading: boolean;
}

const BeamQualityCalculatorForm: React.FC<BeamQualityCalculatorFormProps> = ({
  onCalculate,
  isLoading
}) => {
  const [inputs, setInputs] = useState({
    laserType: 'fiber',
    wavelength: 1070,
    power: 3000,
    beamDiameter: 6.0,
    divergenceAngle: 8.0,
    focalLength: 125,
    measurementDistance: 1000,
    beamProfile: 'gaussian',
    measurementMethod: 'beam_profiler'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    if (!inputs.wavelength || inputs.wavelength < 200 || inputs.wavelength > 12000) {
      newErrors.wavelength = 'Wavelength must be between 200 and 12,000 nm';
    }

    if (!inputs.power || inputs.power < 1 || inputs.power > 50000) {
      newErrors.power = 'Power must be between 1 and 50,000 W';
    }

    if (!inputs.beamDiameter || inputs.beamDiameter < 0.1 || inputs.beamDiameter > 50) {
      newErrors.beamDiameter = 'Beam diameter must be between 0.1 and 50 mm';
    }

    if (!inputs.divergenceAngle || inputs.divergenceAngle < 0.1 || inputs.divergenceAngle > 100) {
      newErrors.divergenceAngle = 'Divergence angle must be between 0.1 and 100 mrad';
    }

    if (!inputs.focalLength || inputs.focalLength < 25 || inputs.focalLength > 500) {
      newErrors.focalLength = 'Focal length must be between 25 and 500 mm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      onCalculate(inputs);
    }
  };

  const laserTypeOptions = [
    { value: 'fiber', label: 'Fiber Laser' },
    { value: 'co2', label: 'CO2 Laser' },
    { value: 'nd_yag', label: 'Nd:YAG Laser' },
    { value: 'disk', label: 'Disk Laser' }
  ];

  const beamProfileOptions = [
    { value: 'gaussian', label: 'Gaussian (TEM00)' },
    { value: 'top_hat', label: 'Top Hat (Flat)' },
    { value: 'multimode', label: 'Multimode' }
  ];

  const measurementMethodOptions = [
    { value: 'beam_profiler', label: 'Beam Profiler' },
    { value: 'ccd_camera', label: 'CCD Camera' },
    { value: 'knife_edge', label: 'Knife Edge' }
  ];

  // Auto-set wavelength based on laser type
  React.useEffect(() => {
    const wavelengths = {
      fiber: 1070,
      co2: 10600,
      nd_yag: 1064,
      disk: 1030
    };
    
    if (wavelengths[inputs.laserType as keyof typeof wavelengths]) {
      setInputs(prev => ({ 
        ...prev, 
        wavelength: wavelengths[inputs.laserType as keyof typeof wavelengths] 
      }));
    }
  }, [inputs.laserType]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microscope className="h-5 w-5 text-purple-600" />
          Beam Quality Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="laser" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="laser" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Laser
              </TabsTrigger>
              <TabsTrigger value="beam" className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                Beam
              </TabsTrigger>
              <TabsTrigger value="optics" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Optics
              </TabsTrigger>
              <TabsTrigger value="measurement" className="flex items-center gap-1">
                <Microscope className="h-4 w-4" />
                Measurement
              </TabsTrigger>
            </TabsList>

            <TabsContent value="laser" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="laserType">Laser Type</Label>
                  <Select
                    value={inputs.laserType}
                    onValueChange={(value) => handleInputChange('laserType', value)}
                    options={laserTypeOptions}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laser type affects wavelength and beam characteristics
                  </p>
                </div>

                <div>
                  <Label htmlFor="wavelength">Wavelength (nm)</Label>
                  <Input
                    id="wavelength"
                    type="number"
                    value={inputs.wavelength}
                    onChange={(e) => handleInputChange('wavelength', parseFloat(e.target.value))}
                    min="200"
                    max="12000"
                    step="1"
                    className={errors.wavelength ? 'border-red-500' : ''}
                  />
                  {errors.wavelength && (
                    <p className="text-xs text-red-500 mt-1">{errors.wavelength}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically set based on laser type
                  </p>
                </div>

                <div>
                  <Label htmlFor="power">Laser Power (W)</Label>
                  <Input
                    id="power"
                    type="number"
                    value={inputs.power}
                    onChange={(e) => handleInputChange('power', parseFloat(e.target.value))}
                    min="1"
                    max="50000"
                    step="1"
                    className={errors.power ? 'border-red-500' : ''}
                  />
                  {errors.power && (
                    <p className="text-xs text-red-500 mt-1">{errors.power}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="beam" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="beamDiameter">Beam Diameter (mm)</Label>
                  <Input
                    id="beamDiameter"
                    type="number"
                    value={inputs.beamDiameter}
                    onChange={(e) => handleInputChange('beamDiameter', parseFloat(e.target.value))}
                    min="0.1"
                    max="50"
                    step="0.1"
                    className={errors.beamDiameter ? 'border-red-500' : ''}
                  />
                  {errors.beamDiameter && (
                    <p className="text-xs text-red-500 mt-1">{errors.beamDiameter}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Beam diameter at 1/e² intensity level
                  </p>
                </div>

                <div>
                  <Label htmlFor="divergenceAngle">Divergence Angle (mrad)</Label>
                  <Input
                    id="divergenceAngle"
                    type="number"
                    value={inputs.divergenceAngle}
                    onChange={(e) => handleInputChange('divergenceAngle', parseFloat(e.target.value))}
                    min="0.1"
                    max="100"
                    step="0.1"
                    className={errors.divergenceAngle ? 'border-red-500' : ''}
                  />
                  {errors.divergenceAngle && (
                    <p className="text-xs text-red-500 mt-1">{errors.divergenceAngle}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Full angle divergence in milliradians
                  </p>
                </div>

                <div>
                  <Label htmlFor="beamProfile">Beam Profile</Label>
                  <Select
                    value={inputs.beamProfile}
                    onValueChange={(value) => handleInputChange('beamProfile', value)}
                    options={beamProfileOptions}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Intensity distribution profile
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="optics" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="focalLength">Focal Length (mm)</Label>
                  <Input
                    id="focalLength"
                    type="number"
                    value={inputs.focalLength}
                    onChange={(e) => handleInputChange('focalLength', parseFloat(e.target.value))}
                    min="25"
                    max="500"
                    step="5"
                    className={errors.focalLength ? 'border-red-500' : ''}
                  />
                  {errors.focalLength && (
                    <p className="text-xs text-red-500 mt-1">{errors.focalLength}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Focusing lens focal length
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Optical System Impact</h4>
                  <div className="space-y-2 text-sm text-purple-800">
                    <p>• Shorter focal length → Smaller focus spot, higher power density</p>
                    <p>• Longer focal length → Larger focus spot, longer working distance</p>
                    <p>• Beam quality affects achievable focus spot size</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="measurement" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="measurementDistance">Measurement Distance (mm)</Label>
                  <Input
                    id="measurementDistance"
                    type="number"
                    value={inputs.measurementDistance}
                    onChange={(e) => handleInputChange('measurementDistance', parseFloat(e.target.value))}
                    min="100"
                    max="10000"
                    step="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Distance from laser output to measurement point
                  </p>
                </div>

                <div>
                  <Label htmlFor="measurementMethod">Measurement Method</Label>
                  <Select
                    value={inputs.measurementMethod}
                    onValueChange={(value) => handleInputChange('measurementMethod', value)}
                    options={measurementMethodOptions}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Method used for beam characterization
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Measurement Standards</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>• ISO 11146: Beam widths and propagation ratios</p>
                    <p>• ISO 11145: Beam parameters vocabulary</p>
                    <p>• ISO 13694: Beam quality measurement methods</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Beam Quality...
              </>
            ) : (
              <>
                <Microscope className="h-4 w-4 mr-2" />
                Analyze Beam Quality
              </>
            )}
          </Button>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Quick Reference</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Excellent M²:</span>
                <span className="font-medium ml-1">≤ 1.1</span>
              </div>
              <div>
                <span className="text-gray-600">Good M²:</span>
                <span className="font-medium ml-1">≤ 1.5</span>
              </div>
              <div>
                <span className="text-gray-600">Fiber Typical:</span>
                <span className="font-medium ml-1">1.05 - 1.2</span>
              </div>
              <div>
                <span className="text-gray-600">CO2 Typical:</span>
                <span className="font-medium ml-1">1.0 - 1.1</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BeamQualityCalculatorForm;
