import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor( private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    // 透過pipe過濾
    .pipe(map((postData) => {
      // 回傳postData的posts使用JS的map方法
      return postData.posts.map(post => {
        // 回傳需要的資料格式
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title,
      content
    };
    // 發送Post請求 定義型別 & 傳送資料post
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId:string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        // 透過filter篩選 , 將post.id不等於postId留在前端渲染陣列中, 只刪除等於的id
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        // 篩選過的陣列重新指定回posts
        this.posts = updatedPosts;
        // Update the copy of this.posts
        this.postsUpdated.next([...this.posts]);
      });
  }
}
