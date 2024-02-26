<template>
  <ReviewItem
      v-for="review in reviews"
      :key="review.id"
      :review="review"
      @vote-up-button-click="activeReview = review; $root.ensureLoggedIn() && voteReviewUp()"
      @vote-down-button-click="activeReview = review; $root.ensureLoggedIn() && voteReviewDown()"
      @comments-button-click="activeReview = review; showComments()"
      @delete-button-click="activeReview = review; $root.confirm('Delete?', 'Yes', 'No').then(yes => yes && deleteReview())"
  />
  <v-btn @click="loadReviews" variant="text" block :disabled="noMoreReviews || $store.getters.loading">{{ noMoreReviews ? 'Nothing more' : 'Load More' }}</v-btn>
  <v-dialog v-model="commentsDialog" width="800">
    <v-card elevation="0">
      <v-card-title>Comments ({{ activeReview.numComments }})</v-card-title>
      <v-divider/>
      <v-card-text>
        <v-textarea v-model="comment" auto-grow hide-details label="Comment" rows="2" variant="underlined"/>
        <v-btn @click="$root.ensureLoggedIn() && postComment()" :disabled="comment === '' || $store.getters.loading" block color="primary" variant="flat">Post</v-btn>
      </v-card-text>
      <template v-for="comment in comments" :key="comment.id">
        <v-card-text>
          <CommentItem
              :comment="comment"
              @vote-up-button-click="activeComment = comment; $root.ensureLoggedIn() && voteCommentUp()"
              @vote-down-button-click="activeComment = comment; $root.ensureLoggedIn() && voteCommentDown()"
              @delete-button-click="this.activeComment = comment; $root.confirm('Delete?', 'Yes', 'No').then(yes => yes && deleteComment())"
          />
        </v-card-text>
        <v-divider/>
      </template>
      <v-btn @click="loadComments" variant="text" block :disabled="noMoreComments || $store.getters.loading">{{ noMoreComments ? 'Nothing more' : 'Load More' }}</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import ReviewItem from '@/components/ReviewItem';
import CommentItem from '@/components/CommentItem';

export default {
  name: 'ReviewList',
  props: ['endpoint'],
  emits: ['reviews-change'],
  components: { ReviewItem, CommentItem },
  data() {
    return {
      reviews: [],
      noMoreReviews: false,
      activeReview: null,
      comments: [],
      noMoreComments: false,
      activeComment: null,
      commentsDialog: false,
      comment: ''
    };
  },
  methods: {
    async loadReviews() {
      this.$store.commit('startLoading');
      try {
        let newReviews = (await axios.get(`${process.env.VUE_APP_BACKEND}${this.endpoint}`, { params: { limit: 10, offset: this.reviews.length } })).data;
        this.reviews.push(...newReviews);
        if (newReviews.length < 10) {
          this.noMoreReviews = true;
        }
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async loadComments() {
      this.$store.commit('startLoading');
      try {
        let newComments = (await axios.get(`${process.env.VUE_APP_BACKEND}/reviews/${this.activeReview.id}/comments`, { params: { limit: 20, offset: this.comments.length } })).data;
        this.comments.push(...newComments);
        if (newComments.length < 20) {
          this.noMoreComments = true;
        }
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async reloadComments() {
      this.comments = [];
      this.noMoreComments = false;
      return await this.loadComments();
    },
    async voteReviewUp() {
      this.$store.commit('startLoading');
      try {
        if (this.activeReview.myVote !== 'U') {
          await axios.put(`${process.env.VUE_APP_BACKEND}/reviews/${this.activeReview.id}/vote`, { vote: 'U' });
          this.activeReview.myVote = 'U';
          ++this.activeReview.upvotes;
        } else {
          await axios.delete(`${process.env.VUE_APP_BACKEND}/reviews/${this.activeReview.id}/vote`);
          this.activeReview.myVote = null;
          --this.activeReview.upvotes;
        }
        this.$emit('reviews-change');
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async voteReviewDown() {
      this.$store.commit('startLoading');
      try {
        if (this.activeReview.myVote !== 'D') {
          await axios.put(`${process.env.VUE_APP_BACKEND}/reviews/${this.activeReview.id}/vote`, { vote: 'D' });
          this.activeReview.myVote = 'D';
          ++this.activeReview.downvotes;
        } else {
          await axios.delete(`${process.env.VUE_APP_BACKEND}/reviews/${this.activeReview.id}/vote`);
          this.activeReview.myVote = null;
          --this.activeReview.downvotes;
        }
        this.$emit('reviews-change');
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async deleteReview() {
      this.$store.commit('startLoading');
      try {
        await axios.delete(`${process.env.VUE_APP_BACKEND}/reviews/${this.activeReview.id}`);
        this.reviews = this.reviews.filter(review => review.id !== this.activeReview.id);
        this.$emit('reviews-change');
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async voteCommentUp() {
      this.$store.commit('startLoading');
      try {
        if (this.activeComment.myVote !== 'U') {
          await axios.put(`${process.env.VUE_APP_BACKEND}/comments/${this.activeComment.id}/vote`, { vote: 'U' });
          this.activeComment.myVote = 'U';
          ++this.activeComment.upvotes;
        } else {
          await axios.delete(`${process.env.VUE_APP_BACKEND}/comments/${this.activeComment.id}/vote`);
          this.activeComment.myVote = null;
          --this.activeComment.upvotes;
        }
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async voteCommentDown() {
      this.$store.commit('startLoading');
      try {
        if (this.activeComment.myVote !== 'D') {
          await axios.put(`${process.env.VUE_APP_BACKEND}/comments/${this.activeComment.id}/vote`, { vote: 'D' });
          this.activeComment.myVote = 'D';
          ++this.activeComment.downvotes;
        } else {
          await axios.delete(`${process.env.VUE_APP_BACKEND}/comments/${this.activeComment.id}/vote`);
          this.activeComment.myVote = null;
          --this.activeComment.downvotes;
        }
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async deleteComment() {
      this.$store.commit('startLoading');
      try {
        await axios.delete(`${process.env.VUE_APP_BACKEND}/comments/${this.activeComment.id}`);
        this.comments = this.comments.filter(comment => comment.id !== this.activeComment.id);
        --this.activeReview.numComments;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async postComment() {
      this.$store.commit('startLoading');
      try {
        await axios.post(`${process.env.VUE_APP_BACKEND}/reviews/${this.activeReview.id}/comments`, { comment: this.comment });
        this.comment = '';
        await this.reloadComments();
        ++this.activeReview.numComments;
      } catch (e) {
        this.$root.showError(e?.response?.data?.message ?? e);
        return false;
      } finally {
        this.$store.commit('endLoading');
      }
      return true;
    },
    async showComments() {
      this.commentsDialog = true;
      return await this.reloadComments();
    }
  },
  async mounted() {
    await this.loadReviews();
  }
};
</script>
