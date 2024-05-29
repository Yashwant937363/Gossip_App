class PeerService {
  create() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
    this.senders = [];
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      if (this.peer.signalingState !== "stable") {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async addTrack({ track, myStream }) {
    if (this.peer) {
      const sender = this.peer.addTrack(track, myStream);
      this.senders.push(sender);
    }
  }
  async disconnect() {
    if (this.peer) {
      this.senders.forEach((sender) => {
        this.peer.removeTrack(sender);
      });
      this.peer.close();
      this.peer.oniceconnectionstatechange = null;
      this.peer = null;
    }
  }
}

export default new PeerService();
