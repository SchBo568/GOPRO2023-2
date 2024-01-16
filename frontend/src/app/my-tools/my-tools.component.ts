import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
import {Sort, MatSortModule} from '@angular/material/sort';
import { SessionStorageService } from '../services/SessionStorageService';
import { ToolService } from '../../ApiServices/ToolService';
import { Observable, Subscription, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { GetToolDto } from '../models/GetTool';
import { ImageService } from '../../ApiServices/ImageService';
import { GetToolPictureDto } from '../models/GetToolPicture';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ModalEditToolComponent } from '../modal-edit-tool/modal-edit-tool.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateDateRangeDto } from '../models/CreateDateRange';
import { DateRangeService } from '../../ApiServices/DateRangeService';
import { GetDateRangeDto } from '../models/GetDateRange';

interface ToolRow {
  id: number | null;
  src: string | null;
  name: string;
  description: string;
  status: string;
}

interface ImageSnippet {
  src?: string | null, 
  file?: File | null
}

@Component({
  selector: 'app-my-tools',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, FlexLayoutModule, MatSortModule, MatGridListModule, MatMenuModule, MatIconModule],
  providers: [ToolService, ImageService, DateRangeService],
  templateUrl: './my-tools.component.html',
  styleUrl: './my-tools.component.scss'
})
export class MyToolsComponent {
  isMobile: boolean = false;
  isLoggedIn?: boolean;
  registeredTools: ToolRow[] = []
  publishedTools: ToolRow[] = []
  maintainanceTools: ToolRow[] = []
  imageUrl: string = "";
  constructor(
    private mediaObserver: MediaObserver,
    public dialog: MatDialog,
    private toolService: ToolService,
    private imageService: ImageService,
    private dateRangeService: DateRangeService
  ) {}

  sessionStorageService: SessionStorageService = new SessionStorageService;
  mediaSub: Subscription = new Subscription;

  uploadedFiles: { url: string, file: File }[] = [];

  openDialog(tool: GetToolDto, toolPictures: GetToolPictureDto[], toolDateRanges: GetDateRangeDto[]): void {
    const dialogRef = this.dialog.open(ModalEditToolComponent, {
      width: '90%',
      height: '90%',
      //Passing data to the dialog
      data: {
        token: this.sessionStorageService.getUser()?.access_token,
        username: this.sessionStorageService.getUser()?.PK_username,
        tool: tool,
        pictures: toolPictures,
        ranges: toolDateRanges
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.openSnackBar(result.message, "success-snackbar");
    });
  }

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
        var observables = response
          .filter(tool => tool.status === "Registered")
          .map(async tool => {
            const toolId = tool.PK_tool_id ?? 1;
            const toolName = tool.name ?? "Test";
            const toolDescription = tool.description ?? "Test";
            const pictures = await (await this.imageService.getPicturesByToolId(tool.PK_tool_id ?? 1)).toPromise();

            console.log(pictures)
  
            if (pictures!.length !== 0 ) {
              const url = pictures![0].imageUrl ?? 'assets/default-image.jpg';
              const imageData = await this.imageService.getImage(url).toPromise();
              const imageBlob = new Blob([imageData!], { type: 'image/jpeg' });
              
              return {
                id: toolId,
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(imageBlob),
                status: "Registered"
              };
            } else {
              const defaultImageBlob = await this.getDefaultImageBlob();
              return {
                id: toolId,
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(defaultImageBlob),
                status: "Registered"
              };
            }
          });
  
        const registeredTools = await Promise.all(observables);
        this.registeredTools = registeredTools;

        observables = response
          .filter(tool => tool.status === "Published")
          .map(async tool => {
            const toolId = tool.PK_tool_id ?? 1;
            const toolName = tool.name ?? "Test";
            const toolDescription = tool.description ?? "Test";
            const pictures = await (await this.imageService.getPicturesByToolId(tool.PK_tool_id ?? 1)).toPromise();

            console.log(pictures)
  
            if (pictures!.length !== 0 ) {
              const url = pictures![0].imageUrl ?? 'assets/default-image.jpg';
              const imageData = await this.imageService.getImage(url).toPromise();
              const imageBlob = new Blob([imageData!], { type: 'image/jpeg' });
              
              return {
                id: toolId,
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(imageBlob),
                status: "Published"
              };
            } else {
              const defaultImageBlob = await this.getDefaultImageBlob();
              return {
                id: toolId,
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(defaultImageBlob),
                status: "Published"
              };
            }
          });
  
        const publishedTools = await Promise.all(observables);
        this.publishedTools = publishedTools;

        observables = response
          .filter(tool => tool.status === "Under Maintainance")
          .map(async tool => {
            const toolId = tool.PK_tool_id ?? 1;
            const toolName = tool.name ?? "Test";
            const toolDescription = tool.description ?? "Test";
            const pictures = await (await this.imageService.getPicturesByToolId(tool.PK_tool_id ?? 1)).toPromise();

            console.log(pictures)
  
            if (pictures!.length !== 0 ) {
              const url = pictures![0].imageUrl ?? 'assets/default-image.jpg';
              const imageData = await this.imageService.getImage(url).toPromise();
              const imageBlob = new Blob([imageData!], { type: 'image/jpeg' });
              
              return {
                id: toolId,
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(imageBlob),
                status: "Under Maintainance"
              };
            } else {
              const defaultImageBlob = await this.getDefaultImageBlob();
              return {
                id: toolId,
                name: toolName,
                description: toolDescription,
                src: URL.createObjectURL(defaultImageBlob),
                status: "Under Maintainance"
              };
            }
          });
  
        const maintainanceTools = await Promise.all(observables);
        this.maintainanceTools = maintainanceTools;
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

  maintain(id: number | null): void {
    this.toolService.editToolById(id ?? 1, {status: "Under Maintainance"}).subscribe(async (response: any) => {
      console.log(response);
  })
  }

  onButtonClick(toolId: number | null): void {
    // Perform actions when the main button is clicked
    console.log(`Main button clicked for tool with id ${toolId}`);
  }
  
  onMenuClickStatus(action: string, toolId: number | null): void {
    console.log(`${action} clicked for tool with id ${toolId}`);
      this.toolService.editToolById(toolId ?? 1, {status: action}).subscribe(async (response: any) => {
        console.log(response);
      })
    
  }

  onMenuClick(action: string, toolId: number | null): void {
    // Perform actions based on the menu item clicked
    console.log(`${action} clicked for tool with id ${toolId}`);
      this.toolService.editToolById(toolId ?? 1, {status: action}).subscribe(async (response: any) => {
        console.log(response);
      })
    
  }

  async onMenuClickUpdate(toolId: number | null): Promise<void> {
    try {
      // Perform actions based on the menu item clicked
      console.log(`clicked for tool with id ${toolId}`);
      
      // Fetch tool details
      const tool: GetToolDto = await (await this.toolService.getToolById(toolId ?? 1)).toPromise() ?? {};
      console.log(tool);
  
      // Fetch tool pictures
      const toolPictures: GetToolPictureDto[] = await (await this.imageService.getPicturesByToolId(toolId!)).toPromise() ?? [{}];
      console.log(toolPictures);

      const toolDateRanges: GetDateRangeDto[] = await (await this.dateRangeService.getDateRangesByToolId(toolId!)).toPromise() ?? [{}];
      console.log(toolDateRanges);
      // Open the dialog after both asynchronous calls are complete
      this.openDialog(tool, toolPictures, toolDateRanges);
    } catch (error) {
      console.error(error);
    }
  }
  
  

  // publish(): void {

  // }

  // edit(): void {

  // }

  // delete(): void {

  // }
}
