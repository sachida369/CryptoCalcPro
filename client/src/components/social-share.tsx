import React from 'react';
import { Facebook, Twitter, MessageCircle, Copy, Linkedin, Send, Mail, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CalculationResults } from "@/types/crypto";
import { formatCurrency, formatPercentage } from "@/lib/calculations";

interface SocialShareProps {
  results: CalculationResults;
  cryptocurrency: string;
  currency: string;
}

export function SocialShare({ results, cryptocurrency, currency }: SocialShareProps) {
  const { toast } = useToast();
  
  const shareText = `Just calculated my ${cryptocurrency.toUpperCase()} investment: ${formatPercentage(results.roiPercentage)} ROI with ${formatCurrency(results.totalProfit, currency)} profit! 🚀`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const text = `${shareText} ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleRedditShare = () => {
    const url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out my crypto investment results!`);
    const body = encodeURIComponent(`${shareText}\n\nCalculate your own crypto profits here: ${shareUrl}`);
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.open(url, '_self');
  };

  const handleDiscordShare = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast({
        title: "Copied for Discord!",
        description: "Message copied to clipboard. Paste it in Discord.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-dark rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-4 text-neon-cyan">Share Your Results</h3>
      <p className="text-gray-300 mb-6 text-sm">
        Share your investment success with friends and followers.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={handleFacebookShare}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </Button>
        
        <Button
          onClick={handleTwitterShare}
          className="bg-sky-500 hover:bg-sky-600 text-white transition-all duration-300 transform hover:scale-105"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
        
        <Button
          onClick={handleLinkedInShare}
          className="bg-blue-700 hover:bg-blue-800 text-white transition-all duration-300 transform hover:scale-105"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
        
        <Button
          onClick={handleWhatsAppShare}
          className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        
        <Button
          onClick={handleTelegramShare}
          className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 transform hover:scale-105"
        >
          <Send className="w-4 h-4 mr-2" />
          Telegram
        </Button>
        
        <Button
          onClick={handleRedditShare}
          className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Reddit
        </Button>
        
        <Button
          onClick={handleEmailShare}
          className="bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
        
        <Button
          onClick={handleDiscordShare}
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Discord
        </Button>
      </div>
      
      {/* Copy Link Button - Full Width */}
      <Button
        onClick={handleCopyLink}
        variant="outline"
        className="w-full glass hover:bg-white/20 border-white/20 transition-all duration-300 transform hover:scale-105 mt-3"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy Share Link
      </Button>
    </div>
  );
}
