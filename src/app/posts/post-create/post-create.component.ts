import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;
  private mode = 'create';
  private postId: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {}
  // 初始化時執行
  ngOnInit() {
    // 建立FormGroup
    this.form = new FormGroup({
      // 建立表單控制器
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      // 建立表單控制器
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    // 訂閱動態路由的參數地圖(paramMap)
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // 若裡面有postId
      if (paramMap.has('postId')) {
        // 判定為edit模式
        this.mode = 'edit';
        // 將postId 指定為參數地圖內取得的路由參數
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        // 將post重新透過postService的getPost方法取得 , 傳入參數this.postId , getPost方法會call API get該postId的資料
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          // 將post重新指定為該方法撈取的單筆資料 , 達成只編輯點選edit紐的資料效果
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  // 當選取上傳圖片
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // 對單一控制器設定值 , 可傳入物件
    this.form.patchValue({image: file});
    // 選取控制器 , 並告訴Angular更新Value並馬上驗證
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    // 藉由FileReader物件 , 能以非同步方式讀取儲存在用戶端的檔案（或原始資料暫存）內容
    const reader = new FileReader();
    // 事件處理器，於讀取完成時觸發。
    reader.onload = () => {
      // 將編碼後的result內容指定回imagePreview
      this.imagePreview = reader.result;
    };
    // readAsDataURL 讀取file,讀取完成後屬性 result 將以 data:URL格式(base64編碼)的字串來表示讀入的資料內容
    reader.readAsDataURL(file);
  }

  onSavePost() {
    // 若表單沒通過認證 return
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      // 使用Service添加Post
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }

    // 重製表單
    this.form.reset();
  }
}
