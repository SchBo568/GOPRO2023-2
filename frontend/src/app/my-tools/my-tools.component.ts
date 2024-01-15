import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
import {Sort, MatSortModule} from '@angular/material/sort';
import { SessionStorageService } from '../services/SessionStorageService';
import { ToolService } from '../../ApiServices/ToolService';
import { Subscription, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { GetToolDto } from '../models/GetTool';
import { ImageService } from '../../ApiServices/ImageService';
import { GetToolPictureDto } from '../models/GetToolPicture';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon, MatIconModule } from '@angular/material/icon';

interface ToolRow {
  src: string | null;
  name: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-my-tools',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, FlexLayoutModule, MatSortModule, MatGridListModule, MatMenuModule, MatIconModule],
  providers: [ToolService, ImageService],
  templateUrl: './my-tools.component.html',
  styleUrl: './my-tools.component.scss'
})
export class MyToolsComponent {
  isMobile: boolean = false;
  isLoggedIn?: boolean;
  registeredTools: ToolRow[] = []
  imageUrl: string = "";
  constructor(
    private mediaObserver: MediaObserver,
    private toolService: ToolService,
    private imageService: ImageService
  ) {}

  sessionStorageService: SessionStorageService = new SessionStorageService;
  mediaSub: Subscription = new Subscription;

  async ngOnInit(): Promise<void> {
    this.mediaSub = this.mediaObserver.asObservable().subscribe(
      (change: MediaChange[]) => {
        this.isMobile = (change[0].mqAlias === 'xs');
        console.log(this.isMobile);
      }
    );

    if (this.sessionStorageService.getUser() != null) {
      this.isLoggedIn = true;
      await this.getOwnerTools()
    } else {
      this.isLoggedIn = false;
    }
  }

  async getOwnerTools() {
    this.toolService.setToken(this.sessionStorageService.getUser()?.access_token ?? "1");
    const username = this.sessionStorageService.getUser()?.PK_username ?? "Default-user";
  
    this.toolService.getToolsByOwner(username).subscribe(async (response: GetToolDto[]) => {
      console.log(response);
  
      if (response.length !== 0) {
        const observables = response
          .filter(tool => tool.status === "Registered")
          .map(async tool => {
            const toolName = tool.name ?? "Test";
            const toolDescription = tool.description ?? "Test";
            const pictures = await this.imageService.getPicturesByToolId(tool.PK_tool_id ?? 1).toPromise();

            console.log(pictures)
  
            if (pictures!.length !== 0 ) {
              const url = pictures![0].imageUrl ?? 'assets/default-image.jpg';
              const imageData = await this.imageService.getImage(url).toPromise();
              const imageBlob = new Blob([imageData!], { type: 'image/jpeg' });
              
              return {
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(imageBlob),
                status: "Registered"
              };
            } else {
              const defaultImageBlob = await this.getDefaultImageBlob();
              return {
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(defaultImageBlob),
                status: "Registered"
              };
            }
          });
  
        const registeredTools = await Promise.all(observables);
        this.registeredTools = registeredTools;
      }
    });
  }
  
  async getDefaultImageBlob(): Promise<Blob> {
    try {
      const response = await fetch('assets/default-image.jpg');
      const imageBlob = await response.blob();
      return imageBlob;
    } catch (error) {
      console.error('Error fetching default image:', error);
      // You might want to return a placeholder image or handle the error differently
      return new Blob(['<placeholder data here>'], { type: 'image/png' });
    }
  }
  


}
