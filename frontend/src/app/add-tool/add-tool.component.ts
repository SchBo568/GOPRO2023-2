import { Component, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatChipEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { UserService } from '../../ApiServices/UserService';
import {MatSelectModule} from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { SessionStorageService } from '../services/SessionStorageService';
import { KioskService } from '../../ApiServices/KioskService';
import { GetKiosks } from '../models/GetKiosks';
import { CategoryService } from '../../ApiServices/CategoryService';
import { GetCategories } from '../models/GetCategories';
import { ImageService } from '../../ApiServices/ImageService';
import { RangeDates } from './RangeDates.dto';
import { CreateToolDto } from '../models/CreateTool';
import { ToolService } from '../../ApiServices/ToolService';
import { GetToolDto } from '../models/GetTool';
//import { ImageService } from '../../ApiServices/ImageService';

interface Condition {
  value: string;
  viewValue: string;
}

interface Kiosk {
  value: number | undefined;
  viewValue: string | undefined;
}

interface ImageSnippet {
  src?: string | null, 
  file?: File | null
}

@Component({
  selector: 'app-add-tool',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MatCardModule,MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MatNativeDateModule,MatButtonModule,],
  providers: [KioskService, CategoryService, ImageService, ToolService],
  templateUrl: './add-tool.component.html',
  styleUrl: './add-tool.component.scss'
})
export class AddToolComponent {
  filteredDates: [RangeDates] = [{start: 'From', end: 'To'}];
  today: Date = new Date();
  isMobile: boolean = false;
  isLoggedIn?: boolean;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  conditions: Condition[] = [
    {value: 'Very Good', viewValue: 'Very Good'},
    {value: 'Good', viewValue: 'Good'},
    {value: 'Satisfying', viewValue: 'Satisfying'},
  ];

  kiosks: Kiosk[] = []
  categories: Kiosk[] = []
  selectedFile: ImageSnippet = {src: null, file: null};

  sessionStorageService: SessionStorageService = new SessionStorageService;

  proTool: CreateToolDto = {
    categoryId:1, 
    code: "1234", 
    condition: "Very Good", 
    description: "Test", 
    kioskPKLocationId: 1, 
    name: "Test", rental_rate: 
    10, status: "registered", 
    userPKUsername:"test"
  };

  // Constructor with injected services
  constructor (
    private mediaObserver: MediaObserver,
    private kioskService: KioskService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private toolService: ToolService
    //private imageService: ImageService
  ) {}

  mediaSub: Subscription = new Subscription;

  addOnBlur = true;
  //readonly separatorKeysCodes = [ENTER, COMMA] as const;

  announcer = inject(LiveAnnouncer);

  remove(date: RangeDates): void {
    const index = this.filteredDates.indexOf(date);

    if (index >= 0) {
      this.filteredDates.splice(index, 1);

      this.announcer.announce(`Removed ${date}`);
    }
  }

  onAddButtonClick() {
    console.log(this.range.value.start?.toLocaleDateString())
    console.log(this.range.value.end?.toLocaleDateString())
    if(typeof this.range.value.start !== undefined || typeof this.range.value.end !== undefined){
      var containsDuplicates = this.hasDuplicates(this.filteredDates);
      console.log("Duplicates: "+containsDuplicates)
      if(!containsDuplicates) {
        this.filteredDates.push(new RangeDates(this.range.value.start!.toLocaleDateString(),this.range.value.end!.toLocaleDateString()));
      }
    }
  }

  // Form controls initialization for user details
  rentalRate = new FormControl("", [Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]);
  toolName = new FormControl("", [Validators.required]);
  description = new FormControl("", [Validators.required]);
  condition?: Condition;
  kiosk?: Kiosk;
  category?: Kiosk;

  // Method to get error message for form fields
  getErrorMessage(field: string) {
    return 'You must enter a value';
  }

  hasDuplicates(array: RangeDates[]): boolean {
    for (let i = 0; i < array.length - 1; i++) {
      if (!array[i] || !array[i].start || !array[i].end) {
        continue; // Skip if the element or its properties are undefined
      }
  
      for (let j = i + 1; j < array.length; j++) {
        if (!array[j] || !array[j].start || !array[j].end) {
          continue; // Skip if the element or its properties are undefined
        }
  
        if (
          array[i].start === array[j].start &&
          array[i].end === array[j].end
        ) {
          // Remove the duplicate immediately upon finding it
          array.splice(j, 1);
          j--; // Decrement j to recheck the current index after splice
        }
      }
    }
  
    return false; // No duplicates found after checking the entire array
  }

  // Lifecycle hook for component initialization
  async ngOnInit(): Promise<void> {
    this.mediaSub = this.mediaObserver.asObservable().subscribe(
      (change: MediaChange[]) => {
        this.isMobile = (change[0].mqAlias === 'xs');
        console.log(this.isMobile);
      }
    );

    if (this.sessionStorageService.getUser() != null) {
      this.isLoggedIn = true;
      console.log("ffffffffff")
      await this.setListKiosk()
      await this.setListCategories()
    } else {
      this.isLoggedIn = false;
    }
  }

  async setListKiosk() {
    this.kioskService.getKiosks().subscribe((response: GetKiosks[]) => {
      console.log("Here: "+response)
      for (const item of response) {
        this.kiosks.push({value: item.PK_location_id, viewValue:"Name: "+item.name + " | Address: " + item.address + " | Total Places: "+item.placeholder});
      }
    })
  }

  async setListCategories() {
    this.categoryService.getCategories().subscribe((response: GetCategories[]) => {
      console.log("Here: "+response)
      for (const item of response) {
        this.categories.push({value: item.PK_category_id, viewValue:"Name: "+item.name + " | Description: " + item.description});
      }
    })
  }

  uploadedFiles: { url: string, file: File }[] = [];

  processFiles(imageInput: HTMLInputElement): void {
    console.log("Called from processFiles " + imageInput);
    const files: FileList | null = imageInput?.files;
  
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Logging the data URL obtained from FileReader
          console.log("Data URL:", e.target.result);
          this.uploadedFiles.push({ url: e.target.result, file });
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  createTool() {
    this.proTool.name = this.toolName.value ?? "t";
    this.proTool.description = this.description.value ?? "t";
    this.proTool.rental_rate = parseFloat(this.rentalRate.value || '1') ?? 9999991;
    this.proTool.condition = this.condition?.value ?? "t";
    this.proTool.kioskPKLocationId = this.kiosk?.value ?? 1;
    this.proTool.categoryId = this.category?.value ?? 1;
    this.proTool.code = this.generateRandomCode(8);
    this.proTool.status = "Registered";
    this.proTool.userPKUsername = this.sessionStorageService.getUser()?.PK_username;

    if(this.toolName.valid && this.description.valid && this.rentalRate.valid) {
      const token = this.sessionStorageService.getUser()?.access_token ?? "0000000000";
      this.toolService.setToken(token);
      this.toolService.createTool(this.proTool).subscribe((response: GetToolDto) => {
        console.log(response.PK_tool_id)
      })
    }
  }

  generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }
  

  upload(toolId: number): void {
    if(this.uploadedFiles.length !== 0) {
        for(var i = 0; i< this.uploadedFiles.length; i++){
          this.imageService.uploadFile(this.uploadedFiles[i].file).subscribe((response: string) => {
          console.log(response)
        })
        }
    }
  }
}
