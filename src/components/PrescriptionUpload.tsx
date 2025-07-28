import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Image as ImageIcon, X, Upload } from 'lucide-react';
import { cameraService } from '@/services/CameraService';
import { useToast } from '@/hooks/use-toast';

interface PrescriptionUploadProps {
  prescriptionImages: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  prescriptionImages,
  onImagesChange,
  maxImages = 3
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);

  const handleCamera = async () => {
    if (prescriptionImages.length >= maxImages) {
      toast({
        title: "Giới hạn ảnh",
        description: `Chỉ có thể tải lên tối đa ${maxImages} ảnh đơn thuốc`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const hasPermission = await cameraService.requestPermissions();
      if (!hasPermission) {
        toast({
          title: "Cần quyền truy cập",
          description: "Vui lòng cấp quyền camera để chụp ảnh đơn thuốc",
          variant: "destructive"
        });
        return;
      }

      const imageData = await cameraService.takePicture();
      if (imageData) {
        onImagesChange([...prescriptionImages, imageData]);
        toast({
          title: "Thành công",
          description: "Đã chụp ảnh đơn thuốc thành công",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể chụp ảnh",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGallery = async () => {
    if (prescriptionImages.length >= maxImages) {
      toast({
        title: "Giới hạn ảnh",
        description: `Chỉ có thể tải lên tối đa ${maxImages} ảnh đơn thuốc`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const hasPermission = await cameraService.requestPermissions();
      if (!hasPermission) {
        toast({
          title: "Cần quyền truy cập",
          description: "Vui lòng cấp quyền thư viện ảnh để chọn ảnh đơn thuốc",
          variant: "destructive"
        });
        return;
      }

      const imageData = await cameraService.selectFromGallery();
      if (imageData) {
        onImagesChange([...prescriptionImages, imageData]);
        toast({
          title: "Thành công",
          description: "Đã chọn ảnh đơn thuốc thành công",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể chọn ảnh",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = prescriptionImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Tải ảnh đơn thuốc</h3>
        <Badge variant="secondary" className="text-xs">
          {prescriptionImages.length}/{maxImages}
        </Badge>
      </div>

      {/* Upload Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleCamera}
          disabled={uploading || prescriptionImages.length >= maxImages}
          className="h-16 flex-col space-y-1"
        >
          <Camera className="h-5 w-5" />
          <span className="text-xs">Chụp ảnh</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleGallery}
          disabled={uploading || prescriptionImages.length >= maxImages}
          className="h-16 flex-col space-y-1"
        >
          <ImageIcon className="h-5 w-5" />
          <span className="text-xs">Từ thư viện</span>
        </Button>
      </div>

      {/* Uploaded Images */}
      {prescriptionImages.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Ảnh đơn thuốc đã tải lên:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {prescriptionImages.map((image, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Đơn thuốc ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {prescriptionImages.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-border rounded-lg">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Chưa có ảnh đơn thuốc nào
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Nhấn các nút trên để tải ảnh lên
          </p>
        </div>
      )}
    </div>
  );
};