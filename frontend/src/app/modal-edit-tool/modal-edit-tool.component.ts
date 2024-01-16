import { Component, Inject, inject } from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
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
import { CreateToolDto } from '../models/CreateTool';
import { ToolService } from '../../ApiServices/ToolService';
import { GetToolDto } from '../models/GetTool';
import { DateRangeService } from '../../ApiServices/DateRangeService';
import { CreateDateRangeDto } from '../models/CreateDateRange';
import { RangeDates } from '../add-tool/RangeDates.dto';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DialogData } from '../user-details/user-details.component';
import { HttpClientModule } from '@angular/common/http';
import { GetToolPictureDto } from '../models/GetToolPicture';
import { DateAdapter } from '@angular/material/core';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GetDateRangeDto } from '../models/GetDateRange';

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
  file?: File  | null,
  blob?: Blob | null
}

interface ImageBody {
  file?: File |  Blob | null,
  toolId?: number | null
}

interface EditToolDialogData {
  token?: string,
  username?: string,
  tool?: GetToolDto,
  pictures?: GetToolPictureDto[],
  ranges?: GetDateRangeDto[]
}

interface RangeDatesBody {
  id: number | null;
  start: Date;
  end: Date;
  from: string;
}

@Component({
  selector: 'app-modal-edit-tool',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MatCardModule,MatSelectModule, MatDialogTitle, MatDialogContent,HttpClientModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MatNativeDateModule,MatButtonModule],
  providers: [KioskService, CategoryService, ImageService, ToolService, DateRangeService, DatePipe, UserService, MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './modal-edit-tool.component.html',
  styleUrl: './modal-edit-tool.component.scss'
})
export class ModalEditToolComponent {
  hide = true
  filteredDates: [RangeDatesBody] = [{id: null, start: new Date ('2023-10-24'), end: new Date ('2023-10-24'), from: "Tester"}];
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
  selectedFile: ImageSnippet = {src: null, file: null, blob: null};

  sessionStorageService: SessionStorageService = new SessionStorageService;

  proTool: CreateToolDto = {
    categoryId:1, 
    code: "1234", 
    condition: "Very Good", 
    description: "Test", 
    kioskPKLocationId: 1, 
    name: "Test", 
    rental_rate: 10, 
    status: "registered", 
    userPKUsername:"test"
  };

  // Constructor with injected services
  constructor (
    private mediaObserver: MediaObserver,
    private kioskService: KioskService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private toolService: ToolService,
    private dateRangeService: DateRangeService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalEditToolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditToolDialogData
    //private imageService: ImageService
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  mediaSub: Subscription = new Subscription;

  addOnBlur = true;

  announcer = inject(LiveAnnouncer);

  remove(date: RangeDatesBody): void {

    const index = this.filteredDates.indexOf(date);

    if (index >= 0) {
      if(date.id == null){
        this.filteredDates.splice(index, 1);
        this.announcer.announce(`Removed ${date}`);
        console.log(date.id)
      } else {
        console.log(date.id)
        this.dateRangeService.deleteDateRangeById(date.id).subscribe((response: any) => {
          console.log(response)
          this.filteredDates.splice(index, 1);
          this.announcer.announce(`Removed ${date}`);
        })
      }
    }
  }

  onAddButtonClick() {
    console.log(this.range.value.start?.toLocaleDateString())
    console.log(this.range.value.end?.toLocaleDateString())
    if(typeof this.range.value.start !== undefined || typeof this.range.value.end !== undefined){
      var containsDuplicates = this.hasDuplicates(this.filteredDates);
      console.log("Duplicates: "+containsDuplicates)
      if(!containsDuplicates) {
        this.filteredDates.push({id: null, start: this.range.value.start!,end: this.range.value.end!, from: "local"});
      }
    }
  }

  // Form controls initialization for user details
  rentalRate = new FormControl<number>(this.data.tool?.rental_rate ?? 1, [Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]);
  toolName = new FormControl(this.data.tool?.name, [Validators.required]);
  description = new FormControl(this.data.tool?.description, [Validators.required]);
  condition = new FormControl<Condition>({
    value: this.data.tool?.condition ?? "Very Good", 
    viewValue: this.data.tool?.condition ?? "Very Good"}, [Validators.required]
    )
  //condition.value = this.data.tool?.condition;
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
      console.log(this.data)
      await this.setListKiosk()
      await this.setListCategories()
      await this.getToolPictures()
      await this.getToolRanges()
    } else {
      this.isLoggedIn = false;
    }
  }

  async getToolPictures() {
    for(var i = 0; i < this.data.pictures?.length!; i++) {
      const imageData = await this.imageService.getImage(this.data.pictures![i].imageUrl ?? "d").toPromise();
      const imageBlob = new Blob([imageData!], { type: 'image/jpeg' });
      const imageFile = blobToFile(imageBlob, "fromDatabase-");
      this.uploadedFiles.push({url: URL.createObjectURL(imageBlob), file: imageBlob, from: "DB"})
    }
  }

  async getToolRanges() {
    if(this.data.ranges)
    for(var i = 0; i < this.data.ranges?.length!; i++) {
      this.filteredDates.push({id: this.data.ranges[i].PK_dateRange_id ?? 1, start: new Date (this.data.ranges[i].start ?? new Date()), end: new Date(this.data.ranges[i].end ?? new Date()), from: "DB"});
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
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

  uploadedFiles: { url: string, file: File | Blob | null, from: string | null }[] = [];

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
          this.uploadedFiles.push({ url: e.target.result, file, from: "local" });
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  updateTool() {
    this.proTool.name = this.toolName.value ?? "t";
    this.proTool.description = this.description.value ?? "t";
    this.proTool.rental_rate = parseFloat(this.rentalRate.value + "") ?? 9999991;
    this.proTool.condition = this.condition.value?.value!;
    this.proTool.kioskPKLocationId = this.kiosk?.value;
    this.proTool.categoryId = this.category?.value;
    this.proTool.code = this.data.tool?.code;
    this.proTool.status = "Registered";
    this.proTool.userPKUsername = this.sessionStorageService.getUser()?.PK_username;

    if(this.toolName.valid && this.description.valid && this.rentalRate.valid) {
      const token = this.sessionStorageService.getUser()?.access_token ?? "0000000000";
      this.toolService.setToken(token);
      this.toolService.editToolById(this.data.tool?.PK_tool_id ?? 1, this.proTool).subscribe(async (response: any) => {
        console.log(response);
        const newFilteredDate: RangeDatesBody[] = this.filteredDates.filter(filteredDates => filteredDates.from === "local")
        console.log(newFilteredDate)
        if(newFilteredDate.length != 0) {
          this.updateDateRange(response.PK_tool_id, newFilteredDate)
        }
        //this.upload(response.PK_tool_id)
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

  upload(toolId?: number): void {
    this.imageService.setToken(this.sessionStorageService.getUser()?.access_token ?? "0000000000")
    if(this.uploadedFiles.length !== 0) {
        for(var i = 0; i< this.uploadedFiles.length; i++){
          if(this.uploadedFiles[i].file instanceof File) {
          const file: File = this.uploadedFiles[i].file as File;
          this.imageService.uploadFile(file, toolId ?? 1).subscribe((response: string) => {
          console.log(response)
        })
        }
        }
    }
  }

  dateRange: CreateDateRangeDto = {}

  updateDateRange(toolId: number, ranges: RangeDatesBody[]): void {
    this.dateRangeService.setToken(this.sessionStorageService.getUser()?.access_token ?? "0000000000")
    console.log(ranges)
    if(ranges.length != 0) {
      for(var i = 0; i <= ranges.length; i++){
        this.dateRange.start = this.datePipe.transform(new Date (ranges[i].start), 'yyyy-MM-dd') ?? "d";
        this.dateRange.end = this.datePipe.transform(new Date (ranges[i].end), 'yyyy-MM-dd') ?? "dd";
        this.dateRange.toolId = toolId;
        this.dateRangeService.createDateRange(this.dateRange).subscribe((response: string) => {
          console.log(response)
        })
      }
    }
  }
}

function blobToFile(blob: Blob, fileName: string) {
  const options = {
    type: blob.type,
    lastModified: Date.now(),
  };

  return new File([blob], fileName, options);
}
