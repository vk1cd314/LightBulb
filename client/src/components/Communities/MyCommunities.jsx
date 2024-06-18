import CommunitiesCard from "../Shared/CommunitiesCard";

const MyCommunities = () => {
    return (
        <div className="flex flex-col items-center mt-10 space-y-3">
            <CommunitiesCard />
            <CommunitiesCard />
            <CommunitiesCard />
        </div>
    );
};

export default MyCommunities;