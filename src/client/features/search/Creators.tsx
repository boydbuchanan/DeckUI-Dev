import { CreatorCard, CreatorCardProps, Icon, Text } from "@deckai/deck-ui";
import { search } from "@api/search";
import { useEffect, useMemo, useState } from "react";
import { profileImage, User } from "@deckai/client/types/cms";
import { useSiteRouter } from "@site";

export default function Creators({
    category,
    interests,
    currentPage,
    onSearch,
    className
  }: {
    category?: string;
    interests?: string[];
    currentPage?: number;

    onSearch?: (total: number) => void;
    className?: string;
  }) {
    const [results, setResults] = useState<User[]>([]);
    const Router = useSiteRouter();
    
    useEffect(() => {
        let active = true;
        load();
        return () => { active = false }

        async function load() {
            //setResults([]) // this is optional
            //console.log(`Loading creators for category: ${category}, interests: ${interests}, page: ${currentPage}`)
            const res = await search.creators(category, interests, currentPage);
            if (!active) { return }
            setResults(res)
            onSearch?.(res.length)
        }
    }, [category, interests, currentPage]);
    
    return results.map((creator) => (
        <CreatorCard
            key={creator.id}
            name={creator.displayName}
            profileImage={profileImage(creator) ?? undefined}
            tags={creator.interests.map((interest) => interest.Display)}
            className={className}
            // badges={creator.badges}
            // random rating between 3.0 and 5.0
            rating={Math.random() * 2 + 3}
            reviewCount={Math.floor(Math.random() * 100)}
            onClick={() => Router.userProfile(creator.Url && creator.Url.length> 0 ? creator.Url : creator.id.toString())}
            // onClick={() => console.log(`View ${creator.Url ?? creator.id}'s profile`)}
            onFavoriteClick={(e) => {
                e.stopPropagation();
                console.log(`Toggle favorite for ${creator.displayName}`);
            }}
        />
    ))
}