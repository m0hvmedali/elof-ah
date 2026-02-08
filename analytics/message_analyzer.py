"""
Message Analytics Engine
=========================
Analyzes 157K messages from messages.json and generates analytics_results.json

Features:
- Top 100 most frequent words
- Activity by hour and day
- Simple mood analysis (keyword-based)
- Message statistics

Usage: Upload to Google Colab or run locally with Python 3.8+
"""

import json
import re
from collections import Counter
from datetime import datetime
import pandas as pd

# ============= CONFIGURATION =============
INPUT_FILE = 'src/assets/data/messages.json'
OUTPUT_FILE = 'public/analytics_results.json'

# Arabic stop words to exclude
STOP_WORDS = {
    'في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'ذلك', 'التي', 'الذي',
    'أن', 'إن', 'كان', 'يكون', 'لا', 'ما', 'هل', 'عن', 'مع', 'او',
    'و', 'ف', 'ب', 'ل', 'ك', 'لم', 'لن', 'قد', 'كل', 'بعض', 'هنا',
    'هناك', 'انا', 'انت', 'هو', 'هي', 'نحن', 'انتم', 'هم', 'the',
    'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'omitted', 'media'  # Filter <Media omitted>
}

# Positive and negative keywords for mood analysis
POSITIVE_KEYWORDS = {
    'حب', 'حبيبي', 'حبيبتي', 'احبك', 'بحبك', 'عشق', 'سعيد', 'سعيدة',
    'فرحان', 'فرحانه', 'مبسوط', 'مبسوطه', 'جميل', 'رائع', 'ممتاز',
    'حلو', 'كويس', 'تمام', 'مشتاق', 'مشتاقة', '❤️', '😍', '🥰', '😊',
    '💕', '💗', '💖', 'love', 'happy', 'good', 'great', 'nice'
}

NEGATIVE_KEYWORDS = {
    'حزين', 'حزينة', 'زعلان', 'زعلانة', 'تعبان', 'تعبانة', 'مش',
    'زعل', 'صعب', 'وحش', 'مش كويس', 'غلط', '😢', '😭', '😔', '💔',
    'sad', 'bad', 'tired', 'upset', 'angry'
}


def load_messages(file_path):
    """Load messages from JSON file"""
    print(f"📂 Loading messages from {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        messages = json.load(f)
    print(f"✅ Loaded {len(messages)} messages")
    return messages


def extract_words(text):
    """Extract Arabic and English words from text"""
    if not text:
        return []
    
    # Remove URLs, mentions, hashtags
    text = re.sub(r'http\S+|www\S+|@\w+|#\w+', '', text)
    
    # Extract Arabic and English words (2+ characters)
    words = re.findall(r'[\u0600-\u06FF]+|[a-zA-Z]{2,}', text.lower())
    
    # Filter stop words
    words = [w for w in words if w not in STOP_WORDS and len(w) > 1]
    
    return words


def analyze_word_frequency(messages):
    """Count most frequent words"""
    print("\n📊 Analyzing word frequency...")
    
    all_words = []
    for msg in messages:
        words = extract_words(msg.get('text', ''))
        all_words.extend(words)
    
    # Get top 100 words
    word_counts = Counter(all_words)
    top_words = [
        {"word": word, "count": count}
        for word, count in word_counts.most_common(100)
    ]
    
    print(f"✅ Found {len(word_counts)} unique words")
    print(f"   Top 5: {[w['word'] for w in top_words[:5]]}")
    
    return top_words


def parse_datetime(msg):
    """Parse datetime from message (handles DD/MM/YY format)"""
    date_str = msg.get('date')
    time_str = msg.get('time')
    
    if not date_str or not time_str:
        return None
    
    try:
        # Parse "29/08/25" and "1:02 am"
        # Assuming YY means 20YY (2025 -> 2025, 24 -> 2024, etc.)
        parts = date_str.split('/')
        if len(parts) == 3:
            day, month, year = parts
            year = '20' + year  # Convert 25 -> 2025
            
            # Parse time
            time_parts = time_str.replace('am', '').replace('pm', '').strip().split(':')
            hour = int(time_parts[0])
            minute = int(time_parts[1]) if len(time_parts) > 1 else 0
            
            # Adjust for PM
            if 'pm' in time_str.lower() and hour != 12:
                hour += 12
            elif 'am' in time_str.lower() and hour == 12:
                hour = 0
            
            dt = datetime(int(year), int(month), int(day), hour, minute)
            return dt
    except Exception as e:
        return None
    
    return None


def analyze_active_hours(messages):
    """Analyze message activity by hour"""
    print("\n⏰ Analyzing active hours...")
    
    hours = Counter()
    
    for msg in messages:
        dt = parse_datetime(msg)
        if dt:
            hours[dt.hour] += 1
    
    # Format as {hour: count}
    active_hours = {f"{h:02d}": hours.get(h, 0) for h in range(24)}
    
    most_active = max(hours.items(), key=lambda x: x[1]) if hours else (0, 0)
    print(f"✅ Most active hour: {most_active[0]:02d}:00 ({most_active[1]} messages)")
    
    return active_hours


def analyze_mood_timeline(messages):
    """Analyze mood evolution by month (simple keyword-based)"""
    print("\n😊 Analyzing mood timeline...")
    
    monthly_sentiment = {}
    
    for msg in messages:
        text = (msg.get('text') or '').lower()
        dt = parse_datetime(msg)
        
        if not dt:
            continue
        
        try:
            month_key = dt.strftime('%Y-%m')
            
            # Simple sentiment: count positive vs negative keywords
            positive_count = sum(1 for kw in POSITIVE_KEYWORDS if kw in text)
            negative_count = sum(1 for kw in NEGATIVE_KEYWORDS if kw in text)
            
            # Sentiment score: -1 to 1
            if positive_count + negative_count > 0:
                sentiment = (positive_count - negative_count) / (positive_count + negative_count)
            else:
                sentiment = 0  # Neutral
            
            if month_key not in monthly_sentiment:
                monthly_sentiment[month_key] = []
            
            monthly_sentiment[month_key].append(sentiment)
        
        except:
            continue
    
    # Average sentiment per month
    mood_timeline = [
        {
            "date": month,
            "sentiment": round(sum(scores) / len(scores), 3) if scores else 0,
            "messageCount": len(scores)
        }
        for month, scores in sorted(monthly_sentiment.items())
    ]
    
    print(f"✅ Analyzed {len(mood_timeline)} months")
    if mood_timeline:
        avg_sentiment = sum(m['sentiment'] for m in mood_timeline) / len(mood_timeline)
        print(f"   Average sentiment: {avg_sentiment:.3f}")
    
    return mood_timeline


def calculate_statistics(messages):
    """Calculate basic statistics"""
    print("\n📈 Calculating statistics...")
    
    dates = []
    for msg in messages:
        dt = parse_datetime(msg)
        if dt:
            dates.append(dt)
    
    stats = {
        "totalMessages": len(messages),
        "dateRange": {
            "start": min(dates).strftime('%Y-%m-%d') if dates else None,
            "end": max(dates).strftime('%Y-%m-%d') if dates else None
        }
    }
    
    print(f"✅ Total messages: {stats['totalMessages']}")
    print(f"   Date range: {stats['dateRange']['start']} to {stats['dateRange']['end']}")
    
    return stats


def main():
    """Main analysis pipeline"""
    print("🚀 Starting Message Analytics Engine...\n")
    
    # Load data
    messages = load_messages(INPUT_FILE)
    
    # Run analyses
    top_words = analyze_word_frequency(messages)
    active_hours = analyze_active_hours(messages)
    mood_timeline = analyze_mood_timeline(messages)
    stats = calculate_statistics(messages)
    
    # Combine results
    results = {
        "topWords": top_words,
        "activeHours": active_hours,
        "moodTimeline": mood_timeline,
        **stats
    }
    
    # Save to JSON
    print(f"\n💾 Saving results to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print("\n✅ Analysis complete!")
    print(f"📄 Results saved to: {OUTPUT_FILE}")
    print(f"\n📊 Summary:")
    print(f"   - Total words analyzed: {sum(w['count'] for w in top_words)}")
    print(f"   - Top word: '{top_words[0]['word']}' ({top_words[0]['count']} times)")
    print(f"   - Mood entries: {len(mood_timeline)} months")


if __name__ == "__main__":
    main()
