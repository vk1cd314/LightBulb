import PropTypes from 'prop-types';

const ProfileStats = ({title, stat}) => {
    return (
        <div className="bg-[#EDEAF8] p-10 rounded-xl ">
            <p className="font-bold text-3xl">{title}</p>
            <p className="text-2xl font-medium mt-5">{Number(stat).toLocaleString()}</p>
        </div>
    );
};

ProfileStats.propTypes = {
    title: PropTypes.string.isRequired,
    stat: PropTypes.number.isRequired
};

export default ProfileStats;