import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

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
  private mode = 'create';
  private postId: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {}
  // 初始化時執行
  ngOnInit() {
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
          this.post = {id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    // 若表單沒通過認證 return
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      // 使用Service添加Post
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    // 重製表單
    form.resetForm();
  }
}
