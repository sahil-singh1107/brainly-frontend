// @ts-nocheck
import { tagsAtom, tokenAtom } from '@/store/atoms/atoms';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const url = import.meta.env.VITE_GET_TAGS;

interface Tag {
  title: string;
}

const SidebarComponent = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [token, setToken] = useRecoilState(tokenAtom);
  const [selectedTags, setSelectedTags] = useRecoilState(tagsAtom);

  // Load selected tags from local storage on component mount
  useEffect(() => {
    const savedTags = localStorage.getItem('selectedTags');
    if (savedTags) {
      setSelectedTags(JSON.parse(savedTags));
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.post(url, { token }).then(function (response) {
        setTags(response.data.data);
      }).catch(function (error) {
        console.log(error);
      });
    }

  }, [token]);

  const handleTagClick = (tagTitle: string) => {
    setSelectedTags(prevSelected => {
      const updatedTags = prevSelected.includes(tagTitle)
        ? prevSelected.filter(title => title !== tagTitle)
        : [...prevSelected, tagTitle];
      localStorage.setItem('selectedTags', JSON.stringify(updatedTags)); // Save updated tags to local storage
      return updatedTags;
    });
  };

  return (
    <>
      <ScrollArea className="m-4 mt-10 rounded-md border p-4 border-none text-center">
        {
          tags.map((tag, i) => (
            <div key={i} className="tag">
              <Button
                variant="outline"
                className={`mt-4 border-[#26262A] ${selectedTags.includes(tag.title) ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => handleTagClick(tag.title)}
              >
                {tag.title}
              </Button>
            </div>
          ))
        }
      </ScrollArea>
    </>
  );
};

export default SidebarComponent;
