import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export class CameraService {
  async takePicture(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      return image.dataUrl || '';
    } catch (error) {
      console.error('Error taking picture:', error);
      throw new Error('Không thể chụp ảnh. Vui lòng thử lại.');
    }
  }

  async selectFromGallery(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      return image.dataUrl || '';
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      throw new Error('Không thể chọn ảnh từ thư viện. Vui lòng thử lại.');
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const permissions = await Camera.requestPermissions({
        permissions: ['camera', 'photos']
      });
      
      return permissions.camera === 'granted' && permissions.photos === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }
}

export const cameraService = new CameraService();