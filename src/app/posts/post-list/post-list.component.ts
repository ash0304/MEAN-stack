import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is the first post\'s content'},
  //   { title: 'Second Post', content: 'This is the second post\'s content'},
  //   { title: 'Third Post', content: 'This is the third post\'s content' },
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsperPage = 2;
  pageSizeOptions = [ 1, 2, 5, 10];
  // 新增變數存放訂閱物件, 利於後續取消訂閱
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  // 防止記憶體洩漏 Memory Leak Destroy時取消訂閱
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
